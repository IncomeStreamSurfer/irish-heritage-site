/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "heritageireland.ie" },
      { protocol: "https", hostname: "www.heritageireland.ie" },
      { protocol: "https", hostname: "blarneycastle.ie" },
      { protocol: "https", hostname: "www.blarneycastle.ie" },
      { protocol: "https", hostname: "www.gettyimages.com" },
      { protocol: "https", hostname: "pixabay.com" },
      { protocol: "https", hostname: "www.cliffsofmoher.ie" },
      { protocol: "https", hostname: "www.kylemoreabbey.com" },
      { protocol: "https", hostname: "ballinderrypark.com" },
      { protocol: "https", hostname: "www.bunrattycastle.ie" },
      { protocol: "https", hostname: "www.carrowmore.com" },
      { protocol: "https", hostname: "www.carrowkeel.com" },
      { protocol: "https", hostname: "www.worldheritageireland.ie" },
      { protocol: "https", hostname: "www.aranislands.ie" },
      { protocol: "https", hostname: "kingjohnscastle.ie" },
      { protocol: "https", hostname: "malahidecastleandgardens.ie" },
      { protocol: "https", hostname: "muckross-house.ie" },
      { protocol: "https", hostname: "powerscourt.com" },
      { protocol: "https", hostname: "www.dunguairecastle.com" },
      { protocol: "https", hostname: "www.nationalparks.ie" },
      { protocol: "https", hostname: "example.com" },
      { protocol: "https", hostname: "en.wikipedia.org" }
    ]
  }
};

export default nextConfig;
