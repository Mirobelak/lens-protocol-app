/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'lens.infura-ipfs.io',
      "", // add your IPFS gateway here
      "avatar.tobi.sh",
      "via.placeholder.com",
      "bafybeigcmbs2wfkccazb5xifosfxymrt33j7u2smgfhxt7khlzwtddxl4m"
    ]
  },
}

module.exports = nextConfig
