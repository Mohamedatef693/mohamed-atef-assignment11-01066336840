const apiKey = "YOUR_API_KEY"
const launchesApi = "https://lldev.thespacedevs.com/2.3.0/launches/upcoming/?limit=10";
const planetsApi = "https://solar-system-opendata-proxy.vercel.app/api/planets";


console.log("hello world")
const sections = document.querySelectorAll(".app-section")
const navLinks = document.querySelectorAll(".nav-link")


const sidebar = document.getElementById("sidebar");
const sidebarToggle = document.getElementById("sidebar-toggle");
const sidebarOverlay = document.getElementById("sidebar-overlay");

sidebar.classList.add("-translate-x-full");
sidebar.classList.add("lg:translate-x-0");

sidebarToggle.addEventListener("click", () => {

    sidebar.classList.toggle("sidebar-open");
    sidebarOverlay.classList.toggle("hidden");

});
sidebarOverlay.addEventListener("click", () => {

    sidebar.classList.remove("sidebar-open");
    sidebarOverlay.classList.add("hidden");

});
navLinks.forEach(link => {

    link.addEventListener("click", () => {

        sidebar.classList.remove("sidebar-open");
        sidebarOverlay.classList.add("hidden");

    });

});


function showSection(sectionId) {
    sections.forEach(section => {
        section.classList.add("hidden");
    })
    navLinks.forEach(link => {
        link.classList.remove("bg-blue-500/10", "text-blue-400");
        link.classList.add("text-slate-300", "hover:bg-slate-800");
    });

    document.getElementById(sectionId).classList.remove("hidden");

    const activeLink = document.querySelector(`[data-section="${sectionId}"]`);

    activeLink.classList.remove("text-slate-300", "hover:bg-slate-800");
    activeLink.classList.add("bg-blue-500/10", "text-blue-400");
}


async function getTodaysNews() {
    try {

        apodLoading.classList.remove("hidden");
        apodImage.classList.add("hidden");
        apodVideo.classList.add("hidden");

        const response = await fetch(
            `https://api.nasa.gov/planetary/apod?api_key=${apiKey}`
        );

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        const data = await response.json();

        showApodData(data);

    } catch (error) {

        console.error(error);

    } finally {

        apodLoading.classList.add("hidden");

    }
}

let currentApod = null;

const apodImage = document.getElementById("apod-image");
const apodTitle = document.getElementById("apod-title");
const apodDate = document.getElementById("apod-date");
const apodDateDetail = document.getElementById("apod-date-detail");
const apodDateInfo = document.getElementById("apod-date-info");
const apodExplanation = document.getElementById("apod-explanation");
const apodCopyright = document.getElementById("apod-copyright");
const apodMediaType = document.getElementById("apod-media-type");
const apodVideo = document.getElementById("apod-video");
const apodDateLabel = document.getElementById("apod-date-label");

const apodDateInput = document.getElementById("apod-date-input");
const loadDateBtn = document.getElementById("load-date-btn");
const todayApodBtn = document.getElementById("today-apod-btn");
const fullResolutionBtn = document.getElementById("fullResolutionBtn");

const apodLoading = document.getElementById("apod-loading");


function showApodData(data) {

    currentApod = data;


    const formattedDate = formatDate(data.date);

    apodTitle.textContent = data.title;
    apodExplanation.textContent = data.explanation;
    apodDateInput.value = data.date;
    apodDateLabel.textContent = formattedDate;
    apodDate.textContent = `Astronomy Picture of the Day - ${formattedDate}`;
    apodDateInfo.textContent = formattedDate;
    apodDateDetail.innerHTML = `
        <i class="far fa-calendar mr-2"></i>${formattedDate}`;

    apodMediaType.textContent =
        data.media_type.charAt(0).toUpperCase() + data.media_type.slice(1);

    if (data.media_type === "image") {

        apodImage.classList.remove("hidden");
        apodVideo.classList.add("hidden");

        apodImage.src = data.url;
        apodImage.alt = data.title;

        fullResolutionBtn.innerHTML =
            `<i class="fas fa-expand mr-2"></i>View Full Resolution`;

    } else {

        apodImage.classList.add("hidden");
        apodVideo.classList.remove("hidden");

        apodVideo.src = data.url;

        fullResolutionBtn.innerHTML =
            `<i class="fab fa-youtube mr-2"></i>Watch on YouTube`;
    }
    apodCopyright.textContent = data.copyright ?? "NASA";


    console.log(data);
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
    });
}
fullResolutionBtn.addEventListener("click", () => {
    if (!currentApod) return;
    if (currentApod.media_type === "image") {
        window.open(
            currentApod.hdurl || currentApod.url,
            "_blank"
        );
    } else {
        window.open(
            currentApod.url,
            "_blank"
        );
    }
});

let currentLaunches = [];
async function getUpcomingLaunches() {

    try {

        const response = await fetch(launchesApi);

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        const data = await response.json();
        currentLaunches = data.results;
        showLaunches(currentLaunches);

        // We'll render the data here later

    } catch (error) {

        console.error(error);

    }

}

function showLaunches(launches) {

    const featuredLaunch = launches[0];
    const otherLaunches = launches.slice(1);
    showFeaturedLaunch(featuredLaunch);
    showLaunchGrid(otherLaunches);

}

const featuredLaunchContainer = document.getElementById("featured-launch");
    function showFeaturedLaunch(launch) {

    featuredLaunchContainer.innerHTML = `
            <div
              class="relative bg-slate-800/30 border border-slate-700 rounded-3xl overflow-hidden group hover:border-blue-500/50 transition-all">
              <div
                class="absolute inset-0 bg-linear-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div class="relative grid grid-cols-1 lg:grid-cols-2 gap-6 p-8">
                <div class="flex flex-col justify-between">
                  <div>
                    <div class="flex items-center gap-3 mb-4">
                      <span
                        class="px-4 py-1.5 bg-blue-500/20 text-blue-400 rounded-full text-sm font-semibold flex items-center gap-2">
                        <i class="fas fa-star"></i>
                        Featured Launch
                      </span>
                      <span
                        class="px-4 py-1.5 bg-green-500/20 text-green-400 rounded-full text-sm font-semibold">
                        ${launch.status.name}
                      </span>
                    </div>
                    <h3 class="text-3xl font-bold mb-3 leading-tight">
                      ${launch.name}
                    </h3>
                    <div
                      class="flex flex-col xl:flex-row xl:items-center gap-4 mb-6 text-slate-400">
                      <div class="flex items-center gap-2">
                        <i class="fas fa-building"></i>
                        <span>${launch.launch_service_provider.name}</span>
                      </div>
                      <div class="flex items-center gap-2">
                        <i class="fas fa-rocket"></i>
                        <span>${launch.rocket.configuration.name}</span>
                      </div>
                    </div>
                    <div
                      class="inline-flex items-center gap-3 px-6 py-3 bg-linear-to-r from-blue-500/20 to-purple-500/20 rounded-xl mb-6">
                      <i class="fas fa-clock text-2xl text-blue-400"></i>
                      <div>
                        <p class="text-2xl font-bold text-blue-400">${getDaysUntilLaunch(launch.net) < 0? "launched": getDaysUntilLaunch(launch.net) === 0 ? "Today" : getDaysUntilLaunch(launch.net)}</p>
                        <p class="text-xs text-slate-400">Days Until Launch</p>
                      </div>
                    </div>
                    <div class="grid xl:grid-cols-2 gap-4 mb-6">
                      <div class="bg-slate-900/50 rounded-xl p-4">
                        <p
                          class="text-xs text-slate-400 mb-1 flex items-center gap-2">
                          <i class="fas fa-calendar"></i>
                          Launch Date
                        </p>
                        <p class="font-semibold">${formatLaunchDate(launch.net)}</p>
                      </div>
                      <div class="bg-slate-900/50 rounded-xl p-4">
                        <p
                          class="text-xs text-slate-400 mb-1 flex items-center gap-2">
                          <i class="fas fa-clock"></i>
                          Launch Time
                        </p>
                        <p class="font-semibold">${formatLaunchTime(launch.net)}</p>
                      </div>
                      <div class="bg-slate-900/50 rounded-xl p-4">
                        <p
                          class="text-xs text-slate-400 mb-1 flex items-center gap-2">
                          <i class="fas fa-map-marker-alt"></i>
                          Location
                        </p>
                        <p class="font-semibold text-sm">${launch.pad.location.name}</p>
                      </div>
                      <div class="bg-slate-900/50 rounded-xl p-4">
                        <p
                          class="text-xs text-slate-400 mb-1 flex items-center gap-2">
                          <i class="fas fa-globe"></i>
                          Country
                        </p>
                        <p class="font-semibold">${launch.pad.location.country_code}</p>
                      </div>
                    </div>
                    <p class="text-slate-300 leading-relaxed mb-6">
                          ${launch.mission?.description || "No mission description available."}

                    </p>
                  </div>
                  <div class="flex flex-col md:flex-row gap-3">
                    <button
                      class="flex-1 self-start md:self-center px-6 py-3 bg-blue-500 rounded-xl hover:bg-blue-600 transition-colors font-semibold flex items-center justify-center gap-2">
                      <i class="fas fa-info-circle"></i>
                      View Full Details
                    </button>
                    <div class="icons self-end md:self-center">
                      <button
                        class="px-4 py-3 bg-slate-700 rounded-xl hover:bg-slate-600 transition-colors">
                        <i class="far fa-heart"></i>
                      </button>
                      <button
                        class="px-4 py-3 bg-slate-700 rounded-xl hover:bg-slate-600 transition-colors">
                        <i class="fas fa-bell"></i>
                      </button>
                    </div>
                  </div>
                </div>
                <div class="relative">
                  <div
                    class="relative h-full min-h-[400px] rounded-2xl overflow-hidden bg-slate-900/50">
                    <img
    src="${launch.image?.image_url || "./assets/images/launch-placeholder.png"}"
    alt="${launch.name}"
    class="w-full h-full object-cover"
    onerror="this.onerror=null; this.src='./assets/images/launch-placeholder.png';">
                    <div
                      class="flex items-center justify-center h-full min-h-[400px] bg-slate-800">
                      <i class="fas fa-rocket text-9xl text-slate-700/50"></i>
                    </div>
                    <div
                      class="absolute inset-0 bg-linear-to-t from-slate-900 via-transparent to-transparent"></div>
                  </div>
                </div>
              </div>
            </div>
    `;

}

function formatLaunchDate(dateString) {

    return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
    });

}

function formatLaunchTime(dateString) {

    return new Date(dateString).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        timeZone: "UTC"
    }) + " UTC";

}

function getDaysUntilLaunch(dateString) {

    const today = new Date();
    const launchDate = new Date(dateString);

    const difference = launchDate - today;

    return Math.ceil(difference / (1000 * 60 * 60 * 24));

}

const launchesGrid = document.getElementById("launches-grid");

function showLaunchGrid(launches) {
    launchesGrid.innerHTML = "";
    launches.forEach((launch) => {
    launchesGrid.innerHTML += createLaunchCard(launch);
});
}


    function createLaunchCard(launch) {

    const daysUntilLaunch = getDaysUntilLaunch(launch.net);

    return `
        <div
            class="bg-slate-800/50 border border-slate-700 rounded-2xl overflow-hidden hover:border-blue-500/30 transition-all group cursor-pointer">

            <div class="relative h-48 bg-slate-900/50 overflow-hidden">

                <img
                    src="${launch.image?.image_url || "./assets/images/launch-placeholder.png"}"
                    alt="${launch.name}"
                    class="w-full h-full object-cover"
                    onerror="this.onerror=null; this.src='./assets/images/launch-placeholder.png';">

                <div class="absolute top-3 right-3">
                    <span
                        class="px-3 py-1 bg-blue-500/90 text-white backdrop-blur-sm rounded-full text-xs font-semibold">
                        ${launch.status.name}
                    </span>
                </div>

            </div>

            <div class="p-5">

                <div class="mb-3">
                    <h4
                        class="font-bold text-lg mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
                        ${launch.name}
                    </h4>

                    <p class="text-sm text-slate-400 flex items-center gap-2">
                        <i class="fas fa-building text-xs"></i>
                        ${launch.launch_service_provider.name}
                    </p>
                </div>

                <div class="space-y-2 mb-4">

                    <div class="flex items-center gap-2 text-sm">
                        <i class="fas fa-calendar text-slate-500 w-4"></i>
                        <span class="text-slate-300">
                            ${formatLaunchDate(launch.net)}
                        </span>
                    </div>

                    <div class="flex items-center gap-2 text-sm">
                        <i class="fas fa-clock text-slate-500 w-4"></i>
                        <span class="text-slate-300">
                            ${formatLaunchTime(launch.net)}
                        </span>
                    </div>

                    <div class="flex items-center gap-2 text-sm">
                        <i class="fas fa-rocket text-slate-500 w-4"></i>
                        <span class="text-slate-300">
                            ${launch.rocket.configuration.name}
                        </span>
                    </div>

                    <div class="flex items-center gap-2 text-sm">
                        <i class="fas fa-map-marker-alt text-slate-500 w-4"></i>
                        <span class="text-slate-300 line-clamp-1">
                            ${launch.pad.location.name}
                        </span>
                    </div>

                </div>

                <div class="flex justify-between items-center mb-4">

                    <span class="text-xs text-slate-400">
                        ${
                            daysUntilLaunch < 0
                                ? "Launched"
                                : daysUntilLaunch === 0
                                ? "Today"
                                : `${daysUntilLaunch} Days`
                        }
                    </span>

                </div>

                <div class="flex items-center gap-2 pt-4 border-t border-slate-700">

                    <button
                        class="flex-1 px-4 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors text-sm font-semibold">
                        Details
                    </button>

                    <button
                        class="px-3 py-2 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors">
                        <i class="far fa-heart"></i>
                    </button>

                </div>

            </div>

        </div>
    `;

}



let planets = [];
async function getPlanets() {

    try {

        const response = await fetch(planetsApi);

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        const data = await response.json();

        planets = data.bodies;

        console.log(planets);

        const earth = planets.find(
            planet => planet.englishName === "Earth"
        );

        showPlanetDetails(earth);

    } catch (error) {

        console.error(error);

    }

}

const planetDetails = document.getElementById("planet-details");


function showPlanetDetails(planet) {

    planetDetails.innerHTML = `

        <div class="xl:col-span-2 bg-slate-800/50 border border-slate-700 rounded-xl md:rounded-2xl p-4 md:p-6 lg:p-8">

            <div class="flex flex-col xl:flex-row xl:items-start gap-6">

                <div class="relative h-48 w-48 md:h-64 md:w-64 mx-auto shrink-0">

                    <img
                        src="${planet.image}"
                        alt="${planet.englishName}"
                        class="w-full h-full object-contain">

                </div>

                <div class="flex-1">

                    <h3 class="text-3xl font-bold mb-4">
                        ${planet.englishName}
                    </h3>

                    <p class="text-slate-300 leading-relaxed mb-6">
                        ${planet.description}
                    </p>

                    <div class="grid grid-cols-2 gap-4">

                        <div class="bg-slate-900/50 rounded-lg p-4">
                            <p class="text-xs text-slate-400">Distance</p>
                            <p class="font-semibold">
                                ${planet.semimajorAxis.toLocaleString()} km
                            </p>
                        </div>

                        <div class="bg-slate-900/50 rounded-lg p-4">
                            <p class="text-xs text-slate-400">Radius</p>
                            <p class="font-semibold">
                                ${planet.meanRadius.toLocaleString()} km
                            </p>
                        </div>

                        <div class="bg-slate-900/50 rounded-lg p-4">
                            <p class="text-xs text-slate-400">Mass</p>
                            <p class="font-semibold">
                                ${planet.mass.massValue} × 10<sup>${planet.mass.massExponent}</sup> kg
                            </p>
                        </div>

                        <div class="bg-slate-900/50 rounded-lg p-4">
                            <p class="text-xs text-slate-400">Density</p>
                            <p class="font-semibold">
                                ${planet.density} g/cm³
                            </p>
                        </div>

                        <div class="bg-slate-900/50 rounded-lg p-4">
                            <p class="text-xs text-slate-400">Orbital Period</p>
                            <p class="font-semibold">
                                ${planet.sideralOrbit} days
                            </p>
                        </div>

                        <div class="bg-slate-900/50 rounded-lg p-4">
                            <p class="text-xs text-slate-400">Rotation</p>
                            <p class="font-semibold">
                                ${planet.sideralRotation} hours
                            </p>
                        </div>

                        <div class="bg-slate-900/50 rounded-lg p-4">
                            <p class="text-xs text-slate-400">Gravity</p>
                            <p class="font-semibold">
                                ${planet.gravity} m/s²
                            </p>
                        </div>

                        <div class="bg-slate-900/50 rounded-lg p-4">
                            <p class="text-xs text-slate-400">Moons</p>
                            <p class="font-semibold">
                                ${planet.moons ? planet.moons.length : 0}
                            </p>
                        </div>

                    </div>

                </div>

            </div>

        </div>

        <div class="space-y-6">

            <div class="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">

                <h4 class="font-semibold mb-4">
                    Discovery Info
                </h4>

                <div class="space-y-3">

                    <div class="flex justify-between">
                        <span class="text-slate-400">Discovered By</span>
                        <span>${planet.discoveredBy || "Unknown"}</span>
                    </div>

                    <div class="flex justify-between">
                        <span class="text-slate-400">Discovery Date</span>
                        <span>${planet.discoveryDate || "Unknown"}</span>
                    </div>

                    <div class="flex justify-between">
                        <span class="text-slate-400">Type</span>
                        <span>${planet.type}</span>
                    </div>

                    <div class="flex justify-between">
                        <span class="text-slate-400">Volume</span>
                        <span>
                            ${planet.vol.volValue} × 10<sup>${planet.vol.volExponent}</sup> km³
                        </span>
                    </div>

                </div>

            </div>

            <div class="bg-slate-800/50 border border-slate-700 rounded-2xl p-6">

                <h4 class="font-semibold mb-4">
                    Orbital Characteristics
                </h4>

                <div class="space-y-3">

                    <div class="flex justify-between">
                        <span class="text-slate-400">Perihelion</span>
                        <span>${planet.perihelion.toLocaleString()} km</span>
                    </div>

                    <div class="flex justify-between">
                        <span class="text-slate-400">Aphelion</span>
                        <span>${planet.aphelion.toLocaleString()} km</span>
                    </div>

                    <div class="flex justify-between">
                        <span class="text-slate-400">Eccentricity</span>
                        <span>${planet.eccentricity}</span>
                    </div>

                    <div class="flex justify-between">
                        <span class="text-slate-400">Inclination</span>
                        <span>${planet.inclination}°</span>
                    </div>

                    <div class="flex justify-between">
                        <span class="text-slate-400">Axial Tilt</span>
                        <span>${planet.axialTilt}°</span>
                    </div>

                    <div class="flex justify-between">
                        <span class="text-slate-400">Average Temperature</span>
                        <span>${planet.avgTemp}°C</span>
                    </div>

                    <div class="flex justify-between">
                        <span class="text-slate-400">Escape Velocity</span>
                        <span>${planet.escape.toLocaleString()} m/s</span>
                    </div>

                </div>

            </div>

        </div>

    `;

}


getPlanets();
getTodaysNews();    

getUpcomingLaunches();
