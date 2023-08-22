import * as pulumi from "@pulumi/pulumi";
import * as k8s from "@pulumi/kubernetes";

const stack = pulumi.getStack();
const gkeStack = stack === "dr" ? new pulumi.StackReference("telushealth/thx-gke/prod") : new pulumi.StackReference(`telushealth/thx-gke/${pulumi.getStack()}`);
const kubeconfig = stack === "dr" ? gkeStack.getOutput("drKubeconfig") : gkeStack.getOutput("kubeconfig")
const provider = new k8s.Provider("k8s", { kubeconfig: kubeconfig, namespace: "thx" });
const config = new pulumi.Config();
const appName = config.require("app-name")
const namespace = config.require("namespace");
const dockerRepoURL = config.require("dockerRepoUrl");
const imageName = config.require("image-name");
const appVersion = config.require("app-version");
export class ThxService extends pulumi.ComponentResource {

    constructor() {
        super(`thx:service:ThxrestService`,appName,{});


        const appLabels = { app: appName };

        const deployment = new k8s.apps.v1.Deployment(appName, {
            metadata: { namespace, labels: appLabels, name: appName },
            spec: {
                selector: { matchLabels: appLabels },
                replicas: 1,
                template: {
                    metadata: { labels: appLabels },
                    spec: { containers: [{ name: appName, image: dockerRepoURL + "/" + imageName + ":" + appVersion }] }
                }
            }
        },{provider: provider});
    }

}
