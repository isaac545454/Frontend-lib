import {
  getWebInstrumentations,
  initializeFaro,
  isInternalFaroOnGlobalObject,
} from "@grafana/faro-web-sdk";
import { TracingInstrumentation } from "@grafana/faro-web-tracing";

const faroCollectorUrl =
  "https://faro-collector-prod-sa-east-1.grafana.net/collect/9afd4442a56048b912fe1301d11c1117";

const telemetryUrl = /sentry\.io|\/monitoring(?:\?|$)|faro-collector/;

if (typeof window !== "undefined" && !isInternalFaroOnGlobalObject()) {
  initializeFaro({
    url: faroCollectorUrl,
    app: {
      name: "front-end-libs",
      version: "1.0.0",
      environment: "production",
    },
    ignoreUrls: [telemetryUrl],
    beforeSend(item) {
      const attributes =
        "attributes" in item.payload ? item.payload.attributes : undefined;
      const name = attributes && "name" in attributes ? String(attributes.name) : "";
      if (telemetryUrl.test(name)) return null;
      return item;
    },
    instrumentations: [
      ...getWebInstrumentations({ captureConsole: false }),
      new TracingInstrumentation(),
    ],
  });
}
