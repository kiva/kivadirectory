// Create a borrowers variable to later assign it to borrowers.json database
var borrowers;

// Create filteredBorrowers, pageNumber and numberOfResultsPerPage to have them accessible globally
var filteredBorrowers;

// Create Json variable
// NOTE: because of CORS errors when displaying the json file locally, it now lives on Gist instead. contact developer for more information
var jsonFile = 'https://gist.githubusercontent.com/incakoala/17eff08476f009b81dba34aa77cde32c/raw/43c039a0a75941cbb14e9956920125b0f8396b44/borrowers.json'

// Create page number specifications to later filter results by page
var pageNumber = 1;
const numberOfResultsPerPage = 4;

// Execute initAutocomplete() when page is loaded to load Google Map functionalities
$(document).ready(function ($) {
  initAutocomplete();
});

// Use fetch to retrieve borrowers.json database, and report any errors that occur in the fetch operation
// once the borrowers have been successfully loaded and formatted as a JSON object
// using response.json(), run the initialize() function
fetch(jsonFile).then(function (response) {
  if (response.ok) {
    response.json().then(function (json) {
      borrowers = json;

      // when search button is click, invoke renderResults() to run the search based on filters
      $(document).on('click', '.search-button', function () {
        runQuery();
        renderResults();
      });

      // Next button
      $(document).on('click', '.next-button', function () {
        const lastPage = filteredBorrowers.length / numberOfResultsPerPage;
        pageNumber = Math.min(
          pageNumber + 1,
          lastPage
        );
        renderResults();
      });

      // Previous button
      $(document).on('click', '.previous-button', function () {
        const firstPage = 1;
        pageNumber = Math.max(
          pageNumber - 1,
          firstPage);
        renderResults();
      });

      // First button
      $(document).on('click', '.first', function () {
        const firstPage = 1;
        pageNumber = Math.min(
          firstPage);
        renderResults();
      });

      // Last button
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

  // when reset button is clicked, set finalGroup equals to database 
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
      fetchBlob(filteredBorrowers[i]);
    }
  }

  // execute fetchBlob, which contains functions that require information from the newly generated filteredBorrowers array (or borrower)
  function fetchBlob(borrower) {
    showResult(borrower);
    addMarker(borrower);
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
    titles.innerText = "Business Name:" + "\n" + "Address:" + "\n" + "  " + (borrower.email ? "\nEmail:" : '');
    para.innerText = borrower.businessName + "\n" + borrower.address1 + "\n" +
      borrower.address2 + "\n" + (borrower.email || '');

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

  // Show Google map markers for the business addresses saved in filterBorrowers array
  function addMarker(borrower) {
    // Geocode given addresses into latlng
    var address = borrower.address1 + " " + borrower.address2
    geocoder.geocode({ 'address': address }, function (results, status) {
      if (status == 'OK') {
        map.setCenter(new google.maps.LatLng(37.798133, -122.453683));
        var marker = new google.maps.Marker({
          map: map,
          position: results[0].geometry.location,
        });
        
        // when marker is clicked, zoom in
        marker.addListener('click', function() {
          map.setZoom(13);
          map.setCenter(marker.getPosition());
        });
        
        // create infoWindow with business name and address
        function addInfoWindow(marker, name, address1, address2) {
          var infoWindow = new google.maps.InfoWindow({
            content: name + " - " + address1 + address2,
            maxWidth: 150,
          });
          
          // when marker is clicked,open infoWindow
          google.maps.event.addListener(marker, 'click', function () {
            infoWindow.open(map, marker);
          });
          
          // when infoWindow is closed, zoom out
          google.maps.event.addListener(infoWindow, 'closeclick', function() {
            map.setZoom(8);
            map.setCenter(new google.maps.LatLng(37.798133, -122.453683));
          });
        }
        addInfoWindow(marker, borrower.businessName, borrower.address1, borrower.address2);
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });
  }
}

// MAP //

// excecute Google map
var geocoder;
var map;
function initAutocomplete(borrower) {
  geocoder = new google.maps.Geocoder();
  var latlng = new google.maps.LatLng(37.798133, -122.453683);
  var mapOptions = {
    zoom: 8,
    center: latlng
  }
  map = new google.maps.Map(document.getElementById('map'), mapOptions);
}