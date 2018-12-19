    /*
    For pagination:
    Have a global page number variable:
    
    var pageNumber = 1;
    
    - This page number variable will be reset every time the user hits search... this means the first line of runQuery can be :
    
    pageNumber = 1;

    The below for loop will look like this:

    const numberOfResultsPerPage = 5;
     for (var i = 0 + numberOfResultsPerPage * (pageNumber - 1); i < numberOfResultsPerPage * (pageNumber); i++) {
      console.log(filteredBorrowers.length);
      fetchBlob(filteredBorrowers[i]);
    }

    Next steps:
    Create next page button
    onclick = function() {
      // extra credit: Don't let the pages be too big or small
      pageNumber = pageNumber + 1;
      renderResults();
      // same as pageNumber += 1;
    }
     */


// create a borrowers variable to later assign it to borrowers.json database
var borrowers;

$(function () {
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
        initialize();
      });
    } else {
      console.log('Network request for borrowers.json failed with response '
        + response.status + ': ' + response.statusText);
    }
  });
})

// Reset button that clears all search filters and returns all borrowers info //

// SEARCH FEATURES //

// reads filters and searchbox then filter json
function runQuery() {
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

  let filteredBorrowers
  // Filter by type
  filteredBorrowers = borrowers.filter(function (borrower) {
    // if (doesBorrowerTypeExist) {
    //   if (borrower.type !== borrowerType) {
    //     return false;
    //   }
    // }
    if (doesBorrowerTypeExist && (borrower.type !== borrowerType)) {
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
  finalGroup = filteredBorrowers;
  renderResults();
}

// clear and generate new results //
function renderResults() {
  // start the process of updating the display with the new set of borrowers
  // remove the previous contents of the <main> element
  while (main.firstChild) {
    main.removeChild(main.firstChild);
  }

  // if no borrowers match the search term, display a "No results to display" message
  if (finalGroup.length === 0) {
    var para = document.createElement('p');
    para.textContent = 'No results to display!';
    main.appendChild(para);
    // for each borrower we want to display, pass its borrower object to fetchBlob()
  } else {
    for (var i = 0; i < finalGroup.length; i++) {
      fetchBlob(finalGroup[i]);
    }
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

  titles.innerText = "Business Name:" + "\n" + "Address:" + "\n" + "  " + "\n" + "Phone:" + "\n" + "Email:";
  para.innerText = borrower.businessName + "\n" + borrower.address1 + "\n" +
    borrower.address2 + "\n" + borrower.phone + "\n" + borrower.email;

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

// sets up the app logic, declares required variables, contains all the other functions
function initialize() {
  var borrowerType = document.querySelector('.borrower-type');
  var sector = document.querySelector('.sector');
  var searchTerm = document.querySelector('.search-term');
  var searchButton = document.querySelector('.search-button');
  main = document.querySelector('main');

  // keep a record of what the last filters entered were
  var lastBorrowerType = borrowerType.value;
  var lastSector = sector.value;
  var lastSearchTerm = ''; //since no search term had been entered yet

  // typeGroup and sectorGroup contain results after filtering by borrower type, sector, and search term
  // finalGroup will contain the borrowers that need to be displayed after
  // the searching has been done. Each will be an array containing objects.
  // Each object will represent a borrower
  var typeGroup;
  var sectorGroup;
  var finalGroup;

  // To start with, set finalGroup to equal the entire borrowers.json database
  // then run updateDisplay(), so ALL borrowers are displayed initially.
  finalGroup = borrowers;
  updateDisplay();

  // Set both to equal an empty array, in time for searches to be run
  typeGroup = [];
  sectorGroup = [];
  finalGroup = [];

  // when the search button is clicked, invoke selectCategory() to start
  // a search running to select the category of products we want to display
  $(document).on('click', '.search-button', function () {
    /* Homework 
    1. runQuery() here and save the filtered results as a global `filteredResults`
    2. Fill out a renderResults() function and have it clear out `.main` and re-generate the results from the global `filteredResults`
    */
    selectType();
  });

  // when the reset button is clicked, set finalGroup equals to database 
  //then invoke UpdateDisplay() to display all borrowers
  $(document).on('click', '.reset-button', function () {
    finalGroup = borrowers;
    updateDisplay();
    // also reset the selected value and entered search term to default
    $(".borrower-type").each(function () { this.selectedIndex = 0 });
    $(".sector").each(function () { this.selectedIndex = 0 });
    $(".search-term").val("");
  });

  function selectType() {
    // Set these back to empty arrays, to clear out the previous search
    typeGroup = [];
    sectorGroup = [];
    finalGroup = [];

    // if the category and search term are the same as they were the last time a
    // search was run, the results will be the same, so there is no point running
    // it again — just return out of the function
    if (borrowerType.value === lastBorrowerType && sector.value ===
      lastSector && searchTerm.value.trim() === lastSearchTerm) {
      return;
    } else {
      // update the record of last category and search term
      lastBorrowerType = borrowerType.value;
      lastSector = sector.value;
      lastSearchTerm = searchTerm.value.trim();
      // In this case we want to select all borrowerss, then filter them by the search
      // term, so we just set categoryGroup to the entire JSON object, then run selectSector()
      if (borrowerType.value === 'All' || borrowerType.value === 'Borrower Type') {
        typeGroup = borrowers;
        selectSector();
        // If a specific category is chosen, we need to filter out the borrowerss not in that
        // category, then put the remaining borrowerss inside categoryGroup, before running
        // selectSecotr()
      } else {
        // the values in the <option> elements are uppercase, whereas the categories
        // store in the JSON (under "type") are lowercase. We therefore need to convert
        // to lower case before we do a comparison
        for (var i = 0; i < borrowers.length; i++) {
          // If a borrower's type property is the same as the chosen category, we want to
          // dispay it, so we push it onto the categoryGroup array
          if (borrowers[i].type === borrowerType.value) {
            typeGroup.push(borrowers[i]);
          }
        }
        // Run selectSector() after the filtering has been done
        selectSector();
      }
    }
  }

  function selectSector() {

    lastBorrowerType = borrowerType.value;
    lastSector = sector.value;
    lastSearchTerm = searchTerm.value.trim();

    if (sector.value === 'All' || sector.value === 'Business Sector') {
      finalGroup = typeGroup;
      updateDisplay();
      // If a specific category is chosen, we need to filter out the borrowers not in that
      // category, then put the remaining borrowers inside categoryGroup, before running
      // selectTerms()
    } else {
      for (var i = 0; i < borrowers.length; i++) {
        // If a borrower's type property is the same as the chosen category, we want to
        // dispay it, so we push it onto the categoryGroup array
        if (borrowers[i].sector === sector.value) {
          sectorGroup.push(typeGroup[i]);
        }
        // run selectTerms() after this second round of filtering has been done
        selectTerms();
      }
    }
  }


  // selectTerms() Takes the group of borrowers selected by selectCategory(), and further
  // filters them by the tnered search term (if one has bene entered)
  function selectTerms() {
    lastBorrowerType = borrowerType.value;
    lastSector = sector.value;
    lastSearchTerm = searchTerm.value.trim();
    // If no search term has been entered, just make the finalGroup array equal to the categoryGroup
    // array — we don't want to filter the borrowers further — then run updateDisplay().
    if (searchTerm.value.trim() === '') {
      finalGroup = sectorGroup;
      updateDisplay();
    } else {
      // Make sure the search term is converted to lower case before comparison. We've kept the
      // borrower names all lower case to keep things simple
      var lowerCaseSearchTerm = searchTerm.value.trim().toLowerCase();
      // For each borrower in categoryGroup, see if the search term is contained inside the borrower name
      // (if the indexOf() result doesn't return -1, it means it is) — if it is, then push the borrower
      // onto the finalGroup array -- sectorGroup[i].keywords.indexOf(lowerCaseSearchTerm) !== -1
      for (var i = 0; i < sectorGroup.length; i++) {
        if (sectorGroup.includes(sectorGroup[i].keywords)) {
          finalGroup.push(sectorGroup[i]);
        }
      }

      // run updateDisplay() after this last round of filtering has been done
      updateDisplay();
    }
  }

  // start the process of updating the display with the new set of borrowers
  function updateDisplay() {
    // remove the previous contents of the <main> element
    while (main.firstChild) {
      main.removeChild(main.firstChild);
    }

    // if no borrowers match the search term, display a "No results to display" message
    if (finalGroup.length === 0) {
      var para = document.createElement('p');
      para.textContent = 'No results to display!';
      main.appendChild(para);
      // for each borrower we want to display, pass its borrower object to fetchBlob()
    } else {
      for (var i = 0; i < finalGroup.length; i++) {
        fetchBlob(finalGroup[i]);
      }
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

    titles.innerText = "Business Name:" + "\n" + "Address:" + "\n" + "  " + "\n" + "Phone:" + "\n" + "Email:";
    para.innerText = borrower.businessName + "\n" + borrower.address1 + "\n" +
      borrower.address2 + "\n" + borrower.phone + "\n" + borrower.email;

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