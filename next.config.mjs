/** @type {import('next').NextConfig} */
const nextConfig = {
	webpack: (config, { dev }) => {
		if (dev) {
			config.watchOptions = {
				...(config.watchOptions ?? {}),
				ignored: [
					...(Array.isArray(config.watchOptions?.ignored) ? config.watchOptions.ignored : []),
					"**/System Volume Information/**",
					"**/pagefile.sys",
					"**/swapfile.sys",
					"**/DumpStack.log.tmp",
				],
			};
		}

		return config;
	},
};

export default nextConfig;
