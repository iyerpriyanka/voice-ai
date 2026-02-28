// Copyright (c) 2023-2025 RapidaAI
// Author: Prashant Srivastav <prashant@rapida.ai>
//
// Licensed under GPL-2.0 with Rapida Additional Terms.
// See LICENSE.md or contact sales@rapida.ai for commercial usage.
package internal_type

import (
	"context"
)

// LLMTextAggregator defines the contract for components that transform
// streamed or batched text inputs into aggregated sentence outputs.
//
// Implementations are expected to:
//   - Accept inputs via Aggregate
//   - Push results directly via the onPacket callback supplied at construction
//   - Release resources on Close
type LLMTextAggregator interface {
	// Aggregate consumes one or more LLM packets and pushes completed
	// sentences to the onPacket callback. Implementations should respect
	// context cancellation and deadlines.
	Aggregate(ctx context.Context, in ...LLMPacket) error

	// Close terminates the aggregator and releases resources.
	Close() error
}
