// Copyright (c) 2023-2025 RapidaAI
// Author: Prashant Srivastav <prashant@rapida.ai>
//
// Licensed under GPL-2.0 with Rapida Additional Terms.
// See LICENSE.md or contact sales@rapida.ai for commercial usage.
package internal_denoiser_krisp

import (
	"context"

	internal_type "github.com/rapidaai/api/assistant-api/internal/type"
	"github.com/rapidaai/pkg/commons"
	"github.com/rapidaai/pkg/utils"
	"github.com/rapidaai/protos"
)

type krispDenoiser struct {
	logger   commons.Logger
	onPacket func(context.Context, ...internal_type.Packet) error
}

func NewKrispDenoiser(ctx context.Context, logger commons.Logger, inCfg *protos.AudioConfig, onPacket func(context.Context, ...internal_type.Packet) error, options utils.Option) (internal_type.Denoiser, error) {
	return &krispDenoiser{logger: logger, onPacket: onPacket}, nil
}

func (krisp *krispDenoiser) Denoise(ctx context.Context, pkt internal_type.DenoiseAudioPacket) error {
	panic("not yet implimented")
}

func (krisp *krispDenoiser) Close() error {
	panic("not yet implimented")
}
