import {KetricsApplication, KetricsService} from "ketrics-utils";
import App from './App.svelte';


const ketricsApplication = new KetricsApplication();
const ketricsService = new KetricsService(ketricsApplication);


const app = new App({
	target: ketricsApplication.container,
	props: {
		ketricsApplication,
		ketricsService
	}
});

export default app;
