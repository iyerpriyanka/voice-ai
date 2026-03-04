// Copyright (c) 2023-2025 RapidaAI
// Author: Prashant Srivastav <prashant@rapida.ai>
//
// Licensed under GPL-2.0 with Rapida Additional Terms.
// See LICENSE.md or contact sales@rapida.ai for commercial usage.

package internal_default_aggregator

import (
	"context"
	"fmt"
	"sync"
	"sync/atomic"
	"testing"
	"time"

	internal_type "github.com/rapidaai/api/assistant-api/internal/type"
	"github.com/rapidaai/pkg/commons"
)

// newCollector returns an onPacket callback and a collect function.
// The callback appends every packet it receives into a thread-safe slice;
// collect returns a snapshot of that slice.
func newCollector() (func(context.Context, ...internal_type.Packet) error, func() []internal_type.Packet) {
	var mu sync.Mutex
	var results []internal_type.Packet
	onPacket := func(_ context.Context, pkts ...internal_type.Packet) error {
		mu.Lock()
		results = append(results, pkts...)
		mu.Unlock()
		return nil
	}
	collect := func() []internal_type.Packet {
		mu.Lock()
		defer mu.Unlock()
		s := make([]internal_type.Packet, len(results))
		copy(s, results)
		return s
	}
	return onPacket, collect
}

func TestNewDefaultLLMTextAggregator(t *testing.T) {
	logger, _ := commons.NewApplicationLogger()
	onPacket, _ := newCollector()

	aggregator, err := NewDefaultLLMTextAggregator(t.Context(), logger, onPacket)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if aggregator == nil {
		t.Fatal("aggregator is nil")
	}
	defer aggregator.Close()

	st := aggregator.(*textAggregator)
	if st.boundaryRegex == nil {
		t.Error("expected boundaryRegex to be set")
	}
}

func TestSingleText(t *testing.T) {
	logger, _ := commons.NewApplicationLogger()
	onPacket, collect := newCollector()
	aggregator, _ := NewDefaultLLMTextAggregator(t.Context(), logger, onPacket)
	defer aggregator.Close()

	err := aggregator.Aggregate(context.Background(), internal_type.LLMResponseDeltaPacket{
		ContextID: "speaker1",
		Text:      "Hello world.",
	})
	if err != nil {
		t.Fatalf("Aggregate failed: %v", err)
	}

	results := collect()
	if len(results) != 1 {
		t.Fatalf("expected 1 result, got %d", len(results))
	}

	ts, ok := results[0].(internal_type.SpeakTextPacket)
	if !ok {
		t.Fatalf("unexpected result type: %T", results[0])
	}
	if ts.Text != "Hello world." {
		t.Errorf("expected 'Hello world.', got %q", ts.Text)
	}
	if ts.ContextID != "speaker1" {
		t.Errorf("expected context 'speaker1', got %q", ts.ContextID)
	}
	if ts.IsFinal {
		t.Error("expected IsFinal=false for sentence from delta")
	}
}

func TestMultipleTexts(t *testing.T) {
	logger, _ := commons.NewApplicationLogger()
	onPacket, collect := newCollector()
	aggregator, _ := NewDefaultLLMTextAggregator(t.Context(), logger, onPacket)
	defer aggregator.Close()

	ctx := context.Background()
	sentences := []string{
		"First sentence.",
		" Second sentence.",
		" Third sentence.",
	}

	for _, s := range sentences {
		aggregator.Aggregate(ctx, internal_type.LLMResponseDeltaPacket{
			ContextID: "speaker1",
			Text:      s,
		})
	}

	results := collect()
	if len(results) != 3 {
		t.Fatalf("expected 3 results, got %d", len(results))
	}

	expected := []string{"First sentence.", " Second sentence.", " Third sentence."}
	for i, result := range results {
		if ts, ok := result.(internal_type.SpeakTextPacket); ok {
			if ts.Text != expected[i] {
				t.Errorf("result %d: expected %q, got %q", i, expected[i], ts.Text)
			}
		}
	}
}

func TestMultipleBoundaries(t *testing.T) {
	logger, _ := commons.NewApplicationLogger()
	ctx := context.Background()

	testCases := []struct {
		input        string
		expected     int
		expectedText string
	}{
		{"What a day!", 1, "What a day!"},
		{"Is this real?", 1, "Is this real?"},
		{"Sure; let's go.", 1, "Sure; let's go."},
		{"One. Two? Three!", 1, "One. Two? Three!"},
	}

	for _, tc := range testCases {
		onPacket, collect := newCollector()
		aggregator, _ := NewDefaultLLMTextAggregator(t.Context(), logger, onPacket)

		err := aggregator.Aggregate(ctx, internal_type.LLMResponseDeltaPacket{
			ContextID: "speaker1",
			Text:      tc.input,
		})
		if err != nil {
			t.Fatalf("Aggregate failed: %v", err)
		}

		results := collect()
		if len(results) != tc.expected {
			t.Errorf("input %q: got %d results (expected %d)", tc.input, len(results), tc.expected)
		}

		if len(results) > 0 {
			if ts, ok := results[0].(internal_type.SpeakTextPacket); ok {
				if ts.Text != tc.expectedText {
					t.Errorf("input %q: expected text %q, got %q", tc.input, tc.expectedText, ts.Text)
				}
			}
		}

		aggregator.Close()
	}
}

func TestUnicodeBoundaries(t *testing.T) {
	logger, _ := commons.NewApplicationLogger()
	ctx := context.Background()

	testCases := []struct {
		name         string
		input        string
		expected     int
		expectedText string
	}{
		{"Japanese period", "こんにちは。元気ですか。", 1, "こんにちは。元気ですか。"},
		{"Devanagari danda", "नमस्ते। कैसे हैं।", 1, "नमस्ते। कैसे हैं।"},
		{"Ellipsis", "Wait… Really…", 1, "Wait… Really…"},
		{"Fullwidth period", "テスト．完了．", 1, "テスト．完了．"},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			onPacket, collect := newCollector()
			aggregator, _ := NewDefaultLLMTextAggregator(t.Context(), logger, onPacket)

			err := aggregator.Aggregate(ctx, internal_type.LLMResponseDeltaPacket{
				ContextID: "speaker1",
				Text:      tc.input,
			})
			if err != nil {
				t.Fatalf("Aggregate failed: %v", err)
			}

			results := collect()
			if len(results) != tc.expected {
				t.Errorf("input %q: got %d results (expected %d)", tc.input, len(results), tc.expected)
			}

			if len(results) > 0 {
				if ts, ok := results[0].(internal_type.SpeakTextPacket); ok {
					if ts.Text != tc.expectedText {
						t.Errorf("input %q: expected text %q, got %q", tc.input, tc.expectedText, ts.Text)
					}
				}
			}

			aggregator.Close()
		})
	}
}

func TestContextSwitching(t *testing.T) {
	logger, _ := commons.NewApplicationLogger()
	onPacket, collect := newCollector()
	aggregator, _ := NewDefaultLLMTextAggregator(t.Context(), logger, onPacket)
	defer aggregator.Close()

	ctx := context.Background()

	aggregator.Aggregate(ctx, internal_type.LLMResponseDeltaPacket{ContextID: "speaker1", Text: "Hello there."})
	aggregator.Aggregate(ctx, internal_type.LLMResponseDeltaPacket{ContextID: "speaker2", Text: "Goodbye."})

	results := collect()
	if len(results) < 2 {
		t.Fatalf("expected at least 2 results, got %d", len(results))
	}

	foundSpeaker1, foundSpeaker2 := false, false
	for _, result := range results {
		if ts, ok := result.(internal_type.SpeakTextPacket); ok {
			switch ts.ContextID {
			case "speaker1":
				foundSpeaker1 = true
				if ts.Text != "Hello there." {
					t.Errorf("speaker1 expected 'Hello there.', got %q", ts.Text)
				}
			case "speaker2":
				foundSpeaker2 = true
				if ts.Text != "Goodbye." {
					t.Errorf("speaker2 expected 'Goodbye.', got %q", ts.Text)
				}
			}
		}
	}
	if !foundSpeaker1 {
		t.Error("expected to find speaker1 result")
	}
	if !foundSpeaker2 {
		t.Error("expected to find speaker2 result")
	}
}

func TestDonePacketFlush(t *testing.T) {
	logger, _ := commons.NewApplicationLogger()
	onPacket, collect := newCollector()
	aggregator, _ := NewDefaultLLMTextAggregator(t.Context(), logger, onPacket)
	defer aggregator.Close()

	ctx := context.Background()

	aggregator.Aggregate(ctx, internal_type.LLMResponseDeltaPacket{ContextID: "speaker1", Text: "This is incomplete"})
	aggregator.Aggregate(ctx, internal_type.LLMResponseDonePacket{ContextID: "speaker1"})

	results := collect()
	if len(results) != 2 {
		t.Fatalf("expected 2 results (flushed text + final), got %d", len(results))
	}

	ts0, ok := results[0].(internal_type.SpeakTextPacket)
	if !ok {
		t.Errorf("expected first result to be SpeakTextPacket, got %T", results[0])
	} else {
		if ts0.Text != "This is incomplete" {
			t.Errorf("expected flushed text 'This is incomplete', got %q", ts0.Text)
		}
		if ts0.IsFinal {
			t.Error("expected IsFinal=false for flushed text")
		}
	}

	ts1, ok := results[1].(internal_type.SpeakTextPacket)
	if !ok {
		t.Errorf("expected second result to be SpeakTextPacket, got %T", results[1])
	} else if !ts1.IsFinal {
		t.Error("expected IsFinal=true for done packet")
	}
}

func TestEmptyInput(t *testing.T) {
	logger, _ := commons.NewApplicationLogger()
	onPacket, collect := newCollector()
	aggregator, _ := NewDefaultLLMTextAggregator(t.Context(), logger, onPacket)
	defer aggregator.Close()

	err := aggregator.Aggregate(context.Background(), internal_type.LLMResponseDeltaPacket{
		ContextID: "speaker1",
		Text:      "",
	})
	if err != nil {
		t.Fatalf("Aggregate should not error on empty input: %v", err)
	}

	results := collect()
	if len(results) != 0 {
		t.Errorf("expected 0 results for empty input, got %d", len(results))
	}
}

func TestContextCancellation(t *testing.T) {
	logger, _ := commons.NewApplicationLogger()
	onPacket, _ := newCollector()
	aggregator, _ := NewDefaultLLMTextAggregator(t.Context(), logger, onPacket)
	defer aggregator.Close()

	ctx, cancel := context.WithCancel(context.Background())
	cancel()

	// With the callback approach there is no channel select, so Aggregate
	// completes synchronously regardless of context cancellation state.
	err := aggregator.Aggregate(ctx, internal_type.LLMResponseDeltaPacket{
		ContextID: "speaker1",
		Text:      "Hello.",
	})
	if err != nil {
		t.Errorf("expected nil error, got %v", err)
	}
}

func TestConcurrentContexts(t *testing.T) {
	logger, _ := commons.NewApplicationLogger()
	onPacket, collect := newCollector()
	aggregator, _ := NewDefaultLLMTextAggregator(t.Context(), logger, onPacket)
	defer aggregator.Close()

	ctx := context.Background()
	var wg sync.WaitGroup
	resultCount := atomic.Int32{}

	for speaker := 0; speaker < 3; speaker++ {
		wg.Add(1)
		go func(speakerID int) {
			defer wg.Done()
			contextID := fmt.Sprintf("speaker%d", speakerID)
			for i := 0; i < 3; i++ {
				aggregator.Aggregate(ctx, internal_type.LLMResponseDeltaPacket{
					ContextID: contextID,
					Text:      fmt.Sprintf("Text %d.", i),
				})
			}
		}(speaker)
	}

	wg.Wait()

	for range collect() {
		resultCount.Add(1)
	}

	if resultCount.Load() == 0 {
		t.Error("expected to receive some results from concurrent aggregation")
	}
}

func TestBufferStateMaintenance(t *testing.T) {
	logger, _ := commons.NewApplicationLogger()
	onPacket, collect := newCollector()
	aggregator, _ := NewDefaultLLMTextAggregator(t.Context(), logger, onPacket)
	defer aggregator.Close()

	ctx := context.Background()

	aggregator.Aggregate(ctx, internal_type.LLMResponseDeltaPacket{ContextID: "speaker1", Text: "Hello"})
	aggregator.Aggregate(ctx, internal_type.LLMResponseDeltaPacket{ContextID: "speaker1", Text: " world"})
	aggregator.Aggregate(ctx, internal_type.LLMResponseDeltaPacket{ContextID: "speaker1", Text: "."})

	results := collect()
	if len(results) != 1 {
		t.Fatalf("expected 1 result, got %d", len(results))
	}

	if ts, ok := results[0].(internal_type.SpeakTextPacket); ok && ts.Text != "Hello world." {
		t.Errorf("expected 'Hello world.', got %q", ts.Text)
	}
}

func TestWhitespaceHandling(t *testing.T) {
	logger, _ := commons.NewApplicationLogger()
	onPacket, collect := newCollector()
	aggregator, _ := NewDefaultLLMTextAggregator(t.Context(), logger, onPacket)
	defer aggregator.Close()

	ctx := context.Background()

	aggregator.Aggregate(ctx, internal_type.LLMResponseDeltaPacket{ContextID: "speaker1", Text: "Hello.   \n  "})
	aggregator.Aggregate(ctx, internal_type.LLMResponseDeltaPacket{ContextID: "speaker1", Text: "World."})

	results := collect()
	if len(results) < 1 {
		t.Fatalf("expected at least 1 result, got %d", len(results))
	}

	if ts, ok := results[0].(internal_type.SpeakTextPacket); ok && ts.Text != "Hello.   \n  " {
		t.Errorf("expected 'Hello.', got %q", ts.Text)
	}
}

func TestMultipleClose(t *testing.T) {
	logger, _ := commons.NewApplicationLogger()
	onPacket, _ := newCollector()
	aggregator, _ := NewDefaultLLMTextAggregator(t.Context(), logger, onPacket)

	err1 := aggregator.Close()
	err2 := aggregator.Close()

	if err1 != nil || err2 != nil {
		t.Errorf("Close should not error on multiple calls: err1=%v, err2=%v", err1, err2)
	}
}

func TestSpecialCharacterBoundaries(t *testing.T) {
	logger, _ := commons.NewApplicationLogger()
	onPacket, collect := newCollector()
	aggregator, _ := NewDefaultLLMTextAggregator(t.Context(), logger, onPacket)
	defer aggregator.Close()

	ctx := context.Background()

	aggregator.Aggregate(ctx, internal_type.LLMResponseDeltaPacket{ContextID: "speaker1", Text: "Really?"})

	results := collect()
	if len(results) != 1 {
		t.Fatalf("expected 1 result, got %d", len(results))
	}

	if ts, ok := results[0].(internal_type.SpeakTextPacket); ok && ts.Text != "Really?" {
		t.Errorf("special character boundary failed: got %q", ts.Text)
	}
}

func TestLargeBatch(t *testing.T) {
	logger, _ := commons.NewApplicationLogger()
	onPacket, collect := newCollector()
	aggregator, _ := NewDefaultLLMTextAggregator(t.Context(), logger, onPacket)
	defer aggregator.Close()

	ctx := context.Background()
	const batchSize = 100

	for i := 0; i < batchSize; i++ {
		aggregator.Aggregate(ctx, internal_type.LLMResponseDeltaPacket{
			ContextID: "speaker1",
			Text:      fmt.Sprintf("Text %d.", i),
		})
	}

	results := collect()
	if len(results) != batchSize {
		t.Errorf("expected %d results, got %d", batchSize, len(results))
	}
}

func TestLLMStreamingInput(t *testing.T) {
	logger, _ := commons.NewApplicationLogger()
	onPacket, collect := newCollector()
	aggregator, _ := NewDefaultLLMTextAggregator(t.Context(), logger, onPacket)
	defer aggregator.Close()

	ctx := context.Background()

	llmChunks := []string{
		"Hello", " world", ", this", " is", " an", " LLM",
		" streamed", " sentence", ".", " Another", " one", "!",
	}

	for _, chunk := range llmChunks {
		if err := aggregator.Aggregate(ctx, internal_type.LLMResponseDeltaPacket{
			ContextID: "llm",
			Text:      chunk,
		}); err != nil {
			t.Errorf("Aggregate failed: %v", err)
			return
		}
		time.Sleep(5 * time.Millisecond)
	}

	results := collect()
	if len(results) != 2 {
		t.Fatalf("expected 2 sentences from LLM stream, got %d", len(results))
	}

	expected := []string{
		"Hello world, this is an LLM streamed sentence.",
		" Another one!",
	}

	for i, r := range results {
		ts, ok := r.(internal_type.SpeakTextPacket)
		if !ok {
			t.Errorf("result %d: unexpected type %T", i, r)
			continue
		}
		if ts.ContextID != "llm" {
			t.Errorf("result %d: expected context 'llm', got %q", i, ts.ContextID)
		}
		if ts.Text != expected[i] {
			t.Errorf("result %d: expected %q, got %q", i, expected[i], ts.Text)
		}
	}
}

func TestLLMStreamingWithPauses(t *testing.T) {
	logger, _ := commons.NewApplicationLogger()
	onPacket, collect := newCollector()
	aggregator, _ := NewDefaultLLMTextAggregator(t.Context(), logger, onPacket)
	defer aggregator.Close()

	ctx := context.Background()
	chunks := []string{"This", " sentence", " arrives", " slowly", "."}

	for _, chunk := range chunks {
		time.Sleep(50 * time.Millisecond)
		_ = aggregator.Aggregate(ctx, internal_type.LLMResponseDeltaPacket{ContextID: "llm", Text: chunk})
	}

	results := collect()
	if len(results) != 1 {
		t.Fatalf("expected 1 sentence, got %d", len(results))
	}

	if ts, ok := results[0].(internal_type.SpeakTextPacket); ok && ts.Text != "This sentence arrives slowly." {
		t.Errorf("unexpected sentence: %q", ts.Text)
	}
}

func TestLLMStreamingWithContextSwitch(t *testing.T) {
	logger, _ := commons.NewApplicationLogger()
	onPacket, collect := newCollector()
	aggregator, _ := NewDefaultLLMTextAggregator(t.Context(), logger, onPacket)
	defer aggregator.Close()

	ctx := context.Background()

	_ = aggregator.Aggregate(ctx, internal_type.LLMResponseDeltaPacket{ContextID: "llm-A", Text: "LLM A is speaking."})
	_ = aggregator.Aggregate(ctx, internal_type.LLMResponseDeltaPacket{ContextID: "llm-B", Text: "Hello from B."})

	results := collect()
	if len(results) < 2 {
		t.Fatalf("expected at least 2 results, got %d", len(results))
	}

	if ts, ok := results[0].(internal_type.SpeakTextPacket); ok {
		if ts.ContextID != "llm-A" {
			t.Errorf("expected first result from llm-A, got %s", ts.ContextID)
		}
	}

	foundB := false
	for _, r := range results {
		if ts, ok := r.(internal_type.SpeakTextPacket); ok && ts.ContextID == "llm-B" {
			foundB = true
		}
	}
	if !foundB {
		t.Error("expected output from llm-B after context switch")
	}
}

func TestLLMStreamingForcedCompletion(t *testing.T) {
	logger, _ := commons.NewApplicationLogger()
	onPacket, collect := newCollector()
	aggregator, _ := NewDefaultLLMTextAggregator(t.Context(), logger, onPacket)
	defer aggregator.Close()

	ctx := context.Background()

	_ = aggregator.Aggregate(ctx, internal_type.LLMResponseDeltaPacket{ContextID: "llm", Text: "This sentence never ends"})
	_ = aggregator.Aggregate(ctx, internal_type.LLMResponseDonePacket{ContextID: "llm"})

	results := collect()
	if len(results) != 2 {
		t.Fatalf("expected 2 results (flushed text + final), got %d", len(results))
	}

	ts0, ok := results[0].(internal_type.SpeakTextPacket)
	if !ok {
		t.Errorf("expected first result to be SpeakTextPacket, got %T", results[0])
	} else {
		if ts0.Text != "This sentence never ends" {
			t.Errorf("expected flushed text 'This sentence never ends', got %q", ts0.Text)
		}
		if ts0.IsFinal {
			t.Error("expected IsFinal=false for flushed text")
		}
	}

	ts1, ok := results[1].(internal_type.SpeakTextPacket)
	if !ok {
		t.Errorf("expected second result to be SpeakTextPacket, got %T", results[1])
	} else if !ts1.IsFinal {
		t.Error("expected IsFinal=true for done packet")
	}
}

func TestLLMStreamingUnformattedButComplete(t *testing.T) {
	logger, _ := commons.NewApplicationLogger()
	onPacket, collect := newCollector()
	aggregator, _ := NewDefaultLLMTextAggregator(t.Context(), logger, onPacket)
	defer aggregator.Close()

	ctx := context.Background()

	chunks := []string{"this", " is", " a", " raw", " llm", " response"}
	for _, chunk := range chunks {
		_ = aggregator.Aggregate(ctx, internal_type.LLMResponseDeltaPacket{ContextID: "llm", Text: chunk})
	}
	_ = aggregator.Aggregate(ctx, internal_type.LLMResponseDonePacket{ContextID: "llm"})

	results := collect()
	if len(results) != 2 {
		t.Fatalf("expected 2 results (flushed text + final), got %d", len(results))
	}

	ts0, ok := results[0].(internal_type.SpeakTextPacket)
	if !ok {
		t.Errorf("expected first result to be SpeakTextPacket, got %T", results[0])
	} else if ts0.Text != "this is a raw llm response" {
		t.Errorf("expected flushed text 'this is a raw llm response', got %q", ts0.Text)
	}

	ts1, ok := results[1].(internal_type.SpeakTextPacket)
	if !ok {
		t.Errorf("expected second result to be SpeakTextPacket, got %T", results[1])
	} else if !ts1.IsFinal {
		t.Error("expected IsFinal=true for done packet")
	}
}
