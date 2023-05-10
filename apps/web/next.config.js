module.exports = {
  output: "standalone",
  reactStrictMode: true,
  transpilePackages: ["ui"],
  images: {
    domains: ["picsum.photos", "ipfs.thirdwebcdn.com"],
  },
  async rewrites() {
		return [
			{
				source: "/",
				destination: "https://meroku-homepage.webflow.io/",
			},
		];
	},
};
