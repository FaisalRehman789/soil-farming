// User functionality
class UserDashboard {
  constructor() {
    this.initSearch();
    this.loadAllSoils();
    this.loadAllDistributors();
    logger.log("User dashboard initialized");
  }

  initSearch() {
    document.getElementById("search-form").addEventListener("submit", (e) => {
      e.preventDefault();
      this.searchSoils();
    });
  }

  searchSoils() {
    const searchTerm = document
      .getElementById("search-input")
      .value.toLowerCase();
    utils.showLoader();

    db.collection("soils")
      .get()
      .then((querySnapshot) => {
        const resultsContainer = document.getElementById("search-results");
        resultsContainer.innerHTML = "";

        if (querySnapshot.empty) {
          resultsContainer.innerHTML = "<p>No soil types found.</p>";
          utils.hideLoader();
          return;
        }

        let foundResults = false;

        querySnapshot.forEach((doc) => {
          const soil = doc.data();
          const matchesName = soil.name.toLowerCase().includes(searchTerm);
          const matchesType = soil.type.toLowerCase().includes(searchTerm);
          const matchesCrop = soil.suitableCrops.some((crop) =>
            crop.toLowerCase().includes(searchTerm)
          );

          if (matchesName || matchesType || matchesCrop) {
            foundResults = true;
            const soilItem = document.createElement("div");
            soilItem.className = "soil-item";
            soilItem.innerHTML = `
                <h3>${soil.name} (${soil.type})</h3>
                <p><strong>Composition:</strong> ${soil.composition}</p>
                <p><strong>pH Level:</strong> ${soil.phLevel}</p>
                <p><strong>Characteristics:</strong> ${soil.characteristics}</p>
                <p><strong>Suitable Crops:</strong> ${soil.suitableCrops.join(
                  ", "
                )}</p>
                <button class="btn btn-info btn-sm" onclick="userDashboard.findDistributorsForSoil('${
                  soil.type
                }')">
                  Find Distributors
                </button>
              `;
            resultsContainer.appendChild(soilItem);
          }
        });

        if (!foundResults) {
          resultsContainer.innerHTML = "<p>No matching soil types found.</p>";
        }
        utils.hideLoader();
      })
      .catch((error) => {
        logger.log(`Error searching soils: ${error}`, "error");
        utils.showError("Error searching soil data.");
        utils.hideLoader();
      });
  }

  loadAllSoils() {
    db.collection("soils")
      .orderBy("name")
      .get()
      .then((querySnapshot) => {
        const soilsList = document.getElementById("all-soils-list");
        soilsList.innerHTML = "";

        if (querySnapshot.empty) {
          soilsList.innerHTML = "<p>No soil types found.</p>";
          return;
        }

        querySnapshot.forEach((doc) => {
          const soil = doc.data();
          const soilItem = document.createElement("div");
          soilItem.className = "soil-item";
          soilItem.innerHTML = `
              <h3>${soil.name} (${soil.type})</h3>
              <p><strong>pH Level:</strong> ${soil.phLevel}</p>
              <p><strong>Suitable Crops:</strong> ${soil.suitableCrops.join(
                ", "
              )}</p>
              <button class="btn btn-info btn-sm" onclick="userDashboard.viewSoilDetails('${
                doc.id
              }')">View Details</button>
            `;
          soilsList.appendChild(soilItem);
        });
      })
      .catch((error) => {
        logger.log(`Error loading all soils: ${error}`, "error");
        utils.showError("Error loading soil data.");
      });
  }

  loadAllDistributors() {
    db.collection("distributors")
      .orderBy("name")
      .get()
      .then((querySnapshot) => {
        const distributorsList = document.getElementById(
          "all-distributors-list"
        );
        distributorsList.innerHTML = "";

        if (querySnapshot.empty) {
          distributorsList.innerHTML = "<p>No distributors found.</p>";
          return;
        }

        querySnapshot.forEach((doc) => {
          const distributor = doc.data();
          const distributorItem = document.createElement("div");
          distributorItem.className = "distributor-item";
          distributorItem.innerHTML = `
              <h3>${distributor.name}</h3>
              <p><strong>Contact:</strong> ${distributor.contact}</p>
              <p><strong>Email:</strong> ${distributor.email}</p>
              <p><strong>Crops Available:</strong> ${distributor.cropsAvailable.join(
                ", "
              )}</p>
              <button class="btn btn-info btn-sm" onclick="userDashboard.viewDistributorDetails('${
                doc.id
              }')">View Details</button>
            `;
          distributorsList.appendChild(distributorItem);
        });
      })
      .catch((error) => {
        logger.log(`Error loading all distributors: ${error}`, "error");
        utils.showError("Error loading distributor data.");
      });
  }

  viewSoilDetails(id) {
    utils.showLoader();
    db.collection("soils")
      .doc(id)
      .get()
      .then((doc) => {
        if (doc.exists) {
          const soil = doc.data();
          const modal = document.getElementById("soil-details-modal");
          document.getElementById("soil-details-name").textContent = soil.name;
          document.getElementById("soil-details-type").textContent = soil.type;
          document.getElementById("soil-details-composition").textContent =
            soil.composition;
          document.getElementById("soil-details-ph").textContent = soil.phLevel;
          document.getElementById("soil-details-nutrients").textContent =
            soil.nutrients;
          document.getElementById("soil-details-crops").textContent =
            soil.suitableCrops.join(", ");
          document.getElementById("soil-details-characteristics").textContent =
            soil.characteristics;

          // Show the modal
          $(modal).modal("show");
        } else {
          utils.showError("Soil details not found.");
        }
        utils.hideLoader();
      })
      .catch((error) => {
        logger.log(`Error viewing soil details: ${error}`, "error");
        utils.showError("Error loading soil details.");
        utils.hideLoader();
      });
  }

  viewDistributorDetails(id) {
    utils.showLoader();
    db.collection("distributors")
      .doc(id)
      .get()
      .then((doc) => {
        if (doc.exists) {
          const distributor = doc.data();
          const modal = document.getElementById("distributor-details-modal");
          document.getElementById("distributor-details-name").textContent =
            distributor.name;
          document.getElementById("distributor-details-contact").textContent =
            distributor.contact;
          document.getElementById("distributor-details-email").textContent =
            distributor.email;
          document.getElementById("distributor-details-address").textContent =
            distributor.address;
          document.getElementById("distributor-details-crops").textContent =
            distributor.cropsAvailable.join(", ");
          document.getElementById("distributor-details-soils").textContent =
            distributor.soilTypesCovered.join(", ");

          // Show the modal
          $(modal).modal("show");
        } else {
          utils.showError("Distributor details not found.");
        }
        utils.hideLoader();
      })
      .catch((error) => {
        logger.log(`Error viewing distributor details: ${error}`, "error");
        utils.showError("Error loading distributor details.");
        utils.hideLoader();
      });
  }

  findDistributorsForSoil(soilType) {
    utils.showLoader();
    db.collection("distributors")
      .where("soilTypesCovered", "array-contains", soilType)
      .get()
      .then((querySnapshot) => {
        const resultsContainer = document.getElementById(
          "distributors-for-soil"
        );
        resultsContainer.innerHTML = "";

        if (querySnapshot.empty) {
          resultsContainer.innerHTML = `<p>No distributors found for ${soilType} soil.</p>`;
          utils.hideLoader();
          return;
        }

        resultsContainer.innerHTML = `<h4>Distributors for ${soilType} soil:</h4>`;

        querySnapshot.forEach((doc) => {
          const distributor = doc.data();
          const distributorItem = document.createElement("div");
          distributorItem.className = "distributor-item";
          distributorItem.innerHTML = `
              <h5>${distributor.name}</h5>
              <p><strong>Contact:</strong> ${distributor.contact}</p>
              <p><strong>Crops Available:</strong> ${distributor.cropsAvailable.join(
                ", "
              )}</p>
              <button class="btn btn-info btn-sm" onclick="userDashboard.viewDistributorDetails('${
                doc.id
              }')">View Details</button>
            `;
          resultsContainer.appendChild(distributorItem);
        });

        // Show the modal
        $("#distributors-modal").modal("show");
        utils.hideLoader();
      })
      .catch((error) => {
        logger.log(`Error finding distributors for soil: ${error}`, "error");
        utils.showError("Error finding distributors.");
        utils.hideLoader();
      });
  }
}

// Initialize user dashboard
const userDashboard = new UserDashboard();
