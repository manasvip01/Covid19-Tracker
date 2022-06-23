// import logo from './logo.svg';
import './App.css';
import React from 'react'
import InfoBox from './components/InfoBox'
import Map from './components/Map'
import Table from './components/Table'
// import LineGraph from './components/LineGraph'
import {FormControl,MenuItem,Select,Card,CardContent} from '@material-ui/core'
import {sortData} from "./components/SortedData"
import "leaflet/dist/leaflet.css";
import numeral from 'numeral';

function App() {
  const [countries,setCountries]=React.useState([])
  const [country,setCountry]=React.useState(["worldwide"])
  const [countryInfo,setCountryInfo]=React.useState({})
  const [tableData,setTableData]=React.useState([])
  const [mapCenter, setMapCenter] = React.useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = React.useState(3);
  const [mapCountries, setMapCountries] = React.useState([]);

  React.useState(()=>{
    fetch("https://disease.sh/v3/covid-19/all")
    .then((response)=>response.json())
    .then((data)=>{
      setCountryInfo(data)
    })
  },[])

  React.useEffect(()=>{
    const getCountriesData=async() =>{
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response)=>response.json())
      .then((data)=>{
         const countries=data.map((country)=>(
          {
            name:country.country,
            value:country.countryInfo.iso2,  
          }
         ))
         const sortedData=sortData(data)
         setTableData(sortedData)
         setMapCountries(data)
         setCountries(countries)
      })
    }
    getCountriesData()
  },[])

  const handleCountryChange=async(event) => {
    const CountryCode=event.target.value;
    setCountry(CountryCode);

    const url=CountryCode==='worldwide'?'https://disease.sh/v3/covid-19/all':`https://disease.sh/v3/covid-19/countries/${CountryCode}`
    await fetch(url)
    .then((response)=>response.json())
    .then((data)=>{
        setCountry(CountryCode)
        setCountryInfo(data)
        setMapCenter([data.countryInfo.lat, data.countryInfo.long])
        setMapZoom(4)
    });
  };

  return (
    <div className="App">
      <div className="app_left">
      <div className="app_header">
     <h1>COVID19 TRACKER</h1>
     <FormControl className="app_dropdown">
      <Select variant="outlined" onChange={handleCountryChange} value={country}>
        <MenuItem value="worldwide">Worldwide</MenuItem>
        {countries.map(country=>(
          <MenuItem value={country.value}>{country.name}</MenuItem>
        ))}
      </Select>
     </FormControl>
      </div>

      <div className="app_stats">
        <InfoBox title="Coronavirus Cases" cases={countryInfo.todayCases} total={countryInfo.cases}></InfoBox>
        <InfoBox title="Recovered Cases" cases={countryInfo.todayRecovered} total={countryInfo.recovered}></InfoBox>
        <InfoBox title="Deaths" cases={countryInfo.todayDeaths} total={countryInfo.deaths}></InfoBox>
      </div>
        <Map 
        countries={mapCountries}
        center={mapCenter}
        zoom={mapZoom}/>
      </div>
      <Card className="app_right">
        <CardContent>
          <h3>Live Cases By Country</h3>
          <Table countries={tableData}></Table>
          {/* <h3>WorldWide New Cases</h3>
          <LineGraph></LineGraph> */}
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
