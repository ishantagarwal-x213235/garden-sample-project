import * as k8s from "@pulumi/kubernetes";
import * as pulumi from "@pulumi/pulumi";

const stack = pulumi.getStack();
const gkeStack = stack === "dr" ? new pulumi.StackReference("telushealth/thx-gke/prod") : new pulumi.StackReference(`telushealth/thx-gke/${pulumi.getStack()}`);
const kubeconfig = stack === "dr" ? gkeStack.getOutput("drKubeconfig") : gkeStack.getOutput("kubeconfig")
const provider = new k8s.Provider("k8s", { kubeconfig: kubeconfig, namespace: "thx" });

export class ThxService extends pulumi.ComponentResource {

    constructor(name: string) {
        super(`thx:service:ThxrestService`,name,{});
        const config = new pulumi.Config();
        const appName = config.require("appName")

        const namespace = config.require("namespace");

        const appLabels = { app: appName };

        const deployment = new k8s.apps.v1.Deployment(appName, {
            metadata: { namespace, labels: appLabels, name: appName },
            spec: {
                selector: { matchLabels: appLabels },
                replicas: 1,
                template: {
                    metadata: { labels: appLabels },
                    spec: { containers: [{ name: appName, image: "us-docker.pkg.dev/th-thx-common-46f5/thx-prod-docker-repo/spring-boot-publish-image:v-875cddd187" }] }
                }
            }
        },{provider: provider});
    }

}
