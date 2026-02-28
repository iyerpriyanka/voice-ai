// Copyright (c) 2023-2025 RapidaAI
// Author: Prashant Srivastav <prashant@rapida.ai>
//
// Licensed under GPL-2.0 with Rapida Additional Terms.
// See LICENSE.md or contact sales@rapida.ai for commercial usage.
package internal_type

import "context"

// Denoiser is an interface that defines the contract for audio denoising operations.
// Implementations of this interface are expected to provide methods for removing
// noise from audio data and flushing any internal state.
type Denoiser interface {
	// Denoise processes the raw audio in pkt and pushes a DenoisedAudioPacket
	// via the onPacket callback instead of returning bytes to the caller.
	// On processing error the denoiser falls back to the original audio and
	// still emits a DenoisedAudioPacket with NoiseReduced=false.
	Denoise(ctx context.Context, pkt DenoiseAudioPacket) error
	// Flush clears any internal state of the denoiser. This method should be
	// called when processing of a stream of audio data is complete or when
	// switching between different audio streams. It ensures that any buffered
	// data or state information is reset, preparing the denoiser for processing
	// new, unrelated audio data.
	Close() error
}
