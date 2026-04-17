export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.svg"]),
	mimeTypes: {".svg":"image/svg+xml"},
	_: {
		client: {start:"_app/immutable/entry/start.I4D4_kO0.js",app:"_app/immutable/entry/app.8JBduyJv.js",imports:["_app/immutable/entry/start.I4D4_kO0.js","_app/immutable/chunks/DyVOAcoC.js","_app/immutable/chunks/1jSRWz31.js","_app/immutable/chunks/B01MEeiu.js","_app/immutable/entry/app.8JBduyJv.js","_app/immutable/chunks/1jSRWz31.js","_app/immutable/chunks/lEc5T8mZ.js","_app/immutable/chunks/C2yUfwT0.js","_app/immutable/chunks/B01MEeiu.js","_app/immutable/chunks/BVMfPE3Z.js","_app/immutable/chunks/CmAQ7PtS.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js'))
		],
		remotes: {
			
		},
		routes: [
			
		],
		prerendered_routes: new Set(["/"]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
