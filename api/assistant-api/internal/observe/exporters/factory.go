// Copyright (c) 2023-2025 RapidaAI
// Author: Prashant Srivastav <prashant@rapida.ai>
//
// Licensed under GPL-2.0 with Rapida Additional Terms.
// See LICENSE.md or contact sales@rapida.ai for commercial usage.
package observe_exporters

import (
	"context"
	"fmt"

	"github.com/rapidaai/api/assistant-api/internal/observe"
	"github.com/rapidaai/config"
	"github.com/rapidaai/pkg/commons"
	"github.com/rapidaai/pkg/connectors"
	"github.com/rapidaai/pkg/utils"
)

// GetExporter returns an EventExporter and MetricExporter for the given
// provider type. It mirrors the transformer factory's switch-based approach.
func GetExporter(
	ctx context.Context,
	logger commons.Logger,
	cfg *config.AppConfig,
	opensearch connectors.OpenSearchConnector,
	provider string,
	opts utils.Option,
) (observe.EventExporter, observe.MetricExporter, error) {
	switch observe.ExporterType(provider) {
	case observe.OTLP_HTTP, observe.OTLP_GRPC:
		otlpCfg := OTLPConfigFromOptions(opts, provider)
		if otlpCfg.Endpoint == "" {
			return nil, nil, nil
		}
		exp, err := NewOTLPExporter(ctx, otlpCfg)
		if err != nil {
			return nil, nil, err
		}
		return exp, exp, nil
	case observe.XRAY:
		exp, err := NewXRayExporter(ctx, opts)
		if err != nil {
			return nil, nil, err
		}
		return exp, exp, nil
	case observe.GOOGLE_TRACE:
		exp, err := NewGoogleTraceExporter(ctx, opts)
		if err != nil {
			return nil, nil, err
		}
		return exp, exp, nil
	case observe.AZURE_MONITOR:
		exp, err := NewAzureMonitorExporter(ctx, opts)
		if err != nil {
			return nil, nil, err
		}
		return exp, exp, nil
	case observe.DATADOG:
		exp, err := NewDatadogExporter(ctx, opts)
		if err != nil {
			return nil, nil, err
		}
		return exp, exp, nil
	case observe.LOGGING:
		exp := NewLoggingExporter(logger)
		return exp, exp, nil
	case observe.OPENSEARCH:
		if opensearch == nil {
			return nil, nil, fmt.Errorf("observe: opensearch connector is not available")
		}
		exp := NewOpenSearchExporter(logger, cfg, opensearch)
		return exp, exp, nil
	default:
		return nil, nil, fmt.Errorf("observe: unknown exporter type %q", provider)
	}
}
