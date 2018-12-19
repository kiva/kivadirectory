// create a borrowers variable to later assign it to borrowers.json database
// create filteredBorrowers, pageNumber and numberOfResultsPerPage to have them accessible globally
var borrowers;
var filteredBorrowers;
var pageNumber = 1;
const numberOfResultsPerPage = 4;

//initAutocomplete() to execute Google Map functionalities
$(document).ready(function ($) {
  initAutocomplete();
});

// use fetch to retrieve borrowers.json database, and report any errors that occur in the fetch operation
// once the borrowers have been successfully loaded and formatted as a JSON object
// using response.json(), run the initialize() function
fetch('borrowers.json').then(function (response) {
  if (response.ok) {
    response.json().then(function (json) {
      borrowers = json;

      // when search button is click, invoke renderResults() to run the search based on filters
      $(document).on('click', '.search-button', function () {
        runQuery();
        renderResults();
      });

      $(document).on('click', '.next-button', function () {
        const lastPage = filteredBorrowers.length / numberOfResultsPerPage;
        pageNumber = Math.min(
          pageNumber + 1,
          lastPage
          );
        renderResults();
      });

      $(document).on('click', '.previous-button', function () {
        const firstPage = 1;
        pageNumber = Math.max(
          pageNumber - 1,
          firstPage);
        renderResults();
      });

      $(document).on('click', '.first', function () {
        const firstPage = 1;
        pageNumber = Math.min(
          firstPage);
        renderResults();
      });

      $(document).on('click', '.last', function () {
        const lastPage = filteredBorrowers.length / numberOfResultsPerPage;
        pageNumber = Math.min(
          lastPage);
        renderResults();
      });

      runQuery();
    });

  } else {
    console.log('Network request for borrowers.json failed with response '
      + response.status + ': ' + response.statusText);
  }
});


// Reset button that clears all search filters and returns all borrowers info //

// SEARCH FEATURES //

// runQuery() performs functionalities for buttons and then reads filters and searchbox then filter json
function runQuery() {
  pageNumber = 1;
  main = document.querySelector('main');

  // Update display so that it shows all of existing borrowers in the database
  filteredBorrowers = borrowers;
  renderResults();

  // reset filteredBorrowers to empty, just in time for a new filtering to execute
  filteredBorrowers = [];

  // when the reset button is clicked, set finalGroup equals to database 
  //then invoke UpdateDisplay() to display all borrowers
  $(document).on('click', '.reset-button', function () {
    filteredBorrowers = borrowers;
    renderResults();

    // also reset the selected value and entered search term to default
    $(".borrower-type").each(function () { this.selectedIndex = 0 });
    $(".sector").each(function () { this.selectedIndex = 0 });
    $(".search-term").val("");
  });

// reads filters and searchbox then filter json
  var borrowerType = document.querySelector('.borrower-type').value;
  let doesBorrowerTypeExist;
  if (borrowerType === '') {
    doesBorrowerTypeExist = false;
  } else {
    doesBorrowerTypeExist = true;
  }

  var sector = document.querySelector('.sector').value;
  let doesSectorExist;
  if (sector === '') {
    doesSectorExist = false;
  } else {
    doesSectorExist = true;
  }

  var searchTerm = document.querySelector('.search-term').value;
  let doesSearchTermsExist;
  if (searchTerm === '') {
    doesSearchTermsExist = false;
  } else {
    doesSearchTermsExist = true;
  }

  // Filter by type
  filteredBorrowers = borrowers.filter(function (borrower) {
    if (doesBorrowerTypeExist && (!borrower.type.includes(borrowerType))) {
      return false;
    }
    // Then Filter by sector
    if (doesSectorExist && (borrower.sector !== sector)) {
      return false;
    }
    // Then Filter by search term

    if (doesSearchTermsExist && (!borrower.keywords.includes(searchTerm))) {
      return false;
    }
    return true;
  });
}

// clear and generate new results //
function renderResults() {
  main = document.querySelector('main');
  // start the process of updating the display with the new set of borrowers
  // remove the previous contents of the <main> element
  while (main.firstChild) {
    main.removeChild(main.firstChild);
  }

  // if no borrowers match the search term, display a "No results to display" message
  if (filteredBorrowers.length === 0) {
    var para = document.createElement('p');
    para.textContent = 'No results to display!';
    main.appendChild(para);
    // for each borrower we want to display, pass its borrower object to fetchBlob()
  } else {
    const resultOffset = numberOfResultsPerPage * (pageNumber - 1);
    const endOfPage = resultOffset + numberOfResultsPerPage;
    const endOfArray = filteredBorrowers.length;
    const lastResultToRender = Math.min(endOfPage, endOfArray);
    for (let i = resultOffset; i < lastResultToRender; i++) {
      console.log(filteredBorrowers.length);
      fetchBlob(filteredBorrowers[i]);
    }
  }

  function fetchBlob(borrower) {
    showResult(borrower);
  }

  // Display a borrower inside the <main> element
  function showResult(borrower) {
    // create sub-elements inside <main>
    var section = document.createElement('section');
    var heading = document.createElement('h1');
    var titles = document.createElement('h2');
    var description = document.createElement('p2');
    var para = document.createElement('p');
    var image = document.createElement('img');
    var website = document.createElement('a1');
    var kiva = document.createElement('a2');

    // give the <section> a classname equal to the borrower "type" property so it will display the correct icon
    // section.setAttribute('class', borrower.type);

    // Give values to newly created elements
    heading.textContent = borrower.name;

    description.innerText = borrower.sector;
    titles.innerText = "Business Name:" + "\n" + "Address:" + "\n" + "  " + (borrower.email ? "\nEmail:": '');
    para.innerText = borrower.businessName + "\n" + borrower.address1 + "\n" +
      borrower.address2 + "\n"  + (borrower.email || '');

    image.src = borrower.image;

    website.innerHTML = ("Website").link(borrower.website);

    kiva.innerHTML = ("Kiva Loan").link(borrower.kivaLink);

    // append the elements to the DOM as appropriate, to add the borrower to the UI
    main.appendChild(section);
    section.appendChild(heading);
    section.appendChild(titles);
    section.appendChild(description);
    section.appendChild(para);
    section.appendChild(image);
    section.appendChild(website);
    section.appendChild(kiva);
  }
}

// MAP //

function initAutocomplete() {
  var map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 37.321488, lng: -121.878506 },
    zoom: 13,
    mapTypeId: 'roadmap'
  });

  // Create the search box and link it to the UI element.
  var input = document.getElementById('pac-input');
  var searchBox = new google.maps.places.SearchBox(input);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  // Bias the SearchBox results towards current map's viewport.
  map.addListener('bounds_changed', function () {
    searchBox.setBounds(map.getBounds());
  });

  var markers = [];
  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener('places_changed', function () {
    var places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }

    // Clear out the old markers.
    markers.forEach(function (marker) {
      marker.setMap(null);
    });
    markers = [];

    // For each place, get the icon, name and location.
    var bounds = new google.maps.LatLngBounds();
    places.forEach(function (place) {
      if (!place.geometry) {
        console.log("Returned place contains no geometry");
        return;
      }
      var icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };

      // Create a marker for each place.
      markers.push(new google.maps.Marker({
        map: map,
        icon: icon,
        title: place.name,
        position: place.geometry.location
      }));

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
  });
}