import React from 'react';
import './App.css';
import 'materialize-css/dist/css/materialize.min.css';
import M from 'materialize-css';
const IPFS = require('ipfs');
const OrbitDB = require('orbit-db');
const moment = require('moment');

class App extends React.Component {
  constructor (props,context) {
    super(props,context)
    this.state = {
      id: null,
      loading:false,
      replicated_data:0,
      agentVersion: null,
      protocolVersion: null,
      addedFileHash: null,
      addedFileContents: null,
      valores: [],
      searchOption:"1",
      searchValue:'',
      searchResult:[],
      searchColumns:
      ['CCID',
        'Serial No.',
        'Address',
        'Issue Date',
        'Cancel Date',
        'Category',
        'Standard',
        'Country Code',
        'Amount',
        'Cancel Remaks',
        'Vintage Start',
        'Vintage End',
        'Measurement',
        'Project ID',
        'Adquisition Recipt',
        'Conversion Price',
        'Conversion Price Crypto'],
      searchColumnsKey: ['CCID',
        'SerialNo',
        'ccAddress',
        'issueDate',
        'cancelDate',
        'ccCategory',
        'ccStandard',
        'countryCode',
        'cancelPrice',
        'cancelRemaks',
        'ccVintageStart',
        'ccVintageEnd',
        'ccMeasurement',
        'ccProjectID',
        'CCAdquisitionRecipt',
        'conversionPrice',
        'conversionPriceCrypto'
      ],
      searchColumnsActive:["0","1","2","3","4","8"],
      db: null
    }
    this.handleOption = this.handleOption.bind(this);
    this.handleValue=this.handleValue.bind(this);
    this.handleSubmit=this.handleSubmit.bind(this);
    this.handleColumns=this.handleColumns.bind(this);
  }

  async componentDidMount () {
    this.setState({db: await this.ops()});
    var elems = document.querySelectorAll('select');
    M.FormSelect.init(elems, {});
  }
  handleOption(e){
    this.setState({searchOption:e.target.value});
  }

  handleValue(e){
    this.setState({searchValue:e.target.value});
  }

  handleColumns(e){
    let value = Array.from(e.target.selectedOptions, option => option.value);
    console.log(value)
    this.setState({searchColumnsActive:value});
  }

  async handleSubmit(e){
    e.preventDefault();
    let date;
    switch (this.state.searchOption) {
      case "1":
        this.setState({searchResult:this.state.db.query((doc) => doc.ccCategory === this.state.searchValue)});
        break;
      case "2":
        this.setState({searchResult:this.state.db.query((doc) => doc.CCID === this.state.searchValue)});
        break;
      case "3":
        this.setState({searchResult:this.state.db.query((doc) => doc.SerialNo === this.state.searchValue)});
        break;
      case "4":
        this.setState({searchResult:this.state.db.query((doc) => doc.ccStandard === this.state.searchValue)});
        break;
      case "5":
        this.setState({searchResult:this.state.db.query((doc) => doc.ccProjectID === this.state.searchValue)});
        break;
      case "6":
        date = moment.utc(this.state.searchValue + ' +0000', 'DD-MM-YYYY HH:mm');
        date = date.format('DD-MM-YYYY HH:mm Z')
        this.setState({searchResult:this.state.db.query((doc) => doc.ccVintageStart === moment(date + ' +0000', 'DD-MM-YYYY HH:mm Z').unix())});
        break;
      case "7":
        date = moment.utc(this.state.searchValue + ' +0000', 'DD-MM-YYYY HH:mm');
        date = date.format('DD-MM-YYYY HH:mm Z')
        this.setState({searchResult:this.state.db.query((doc) => doc.ccVintageEnd === moment(date + ' +0000', 'DD-MM-YYYY HH:mm Z').unix())});
        break;
      case "8":
        this.setState({searchResult:this.state.db.query((doc) => doc.CCAdquisitionRecipt === this.state.searchValue)});
        break;
      case "9":
        date = moment.utc(this.state.searchValue + ' +0000', 'DD-MM-YYYY HH:mm');
        date = date.format('DD-MM-YYYY HH:mm Z')
        this.setState({searchResult:this.state.db.query((doc) => doc.cancelDate === moment(date + ' +0000', 'DD-MM-YYYY HH:mm Z').unix())});
        break;
      default:
        break;
    } 
  }

  async ops () {
    const ipfs = await IPFS.create({
      repo: 'ipfs/decacc/',
      relay: {
        enabled: true, 
        hop: {
          enabled: true
        }
      },
      config: {
        Bootstrap: []
      }
    });
    const info = await ipfs.id()
    console.log('IPFS node ready with id ' + info.id)
    try{
       await ipfs.swarm.connect('/dns4/node5.deca.green/tcp/443/wss/p2p/QmZL1otpiCzWMEJTHXbQ5Hb4aFE7TKLjAuuBAAet1WAgtD');
    }catch (error)
    {
      console.log(error)
    } 
    try{
       await ipfs.swarm.connect('/dns4/node0.deca.green/tcp/443/wss/p2p/Qmd4Cv2fNwixP6cabEnTVFkF57GUGD6VBEcDhUkqHPG4X9');
    }catch (error)
    {
      console.log(error)
    } 
    try{
       await ipfs.swarm.connect('/dns4/node4.deca.green/tcp/443/wss/p2p/QmQAbhxMCjQpNrdU3xJYZjjmd7bHXUGcLx2o7wfpvvzJvc');
    }catch (error)
    {
      console.log(error)
    } 
    try{
       await ipfs.swarm.connect("/dns4/node2.deca.green/tcp/443/wss/p2p/QmfBASmqe3Az9AUjCxx3dtomSmbZEiJCsXusPxznjNnjU5");
    }catch (error)
    {
      console.log(error)
    } 
    try{
       await ipfs.swarm.connect("/dns4/node.neetsec.com/tcp/443/wss/p2p/QmYDVy4LE5wsNecmHPpyUp8MDuSRtpYtQuDjpLhvRjfKTj");
    }catch (error)
    {
      console.log(error)
    } 
    const orbitdb = await OrbitDB.createInstance(ipfs);
    const db = await orbitdb.docs("/orbitdb/zdpuAykPJ4qtBg2toS2vxr5eaPfGEBJmvGerM7V7x8qn5c8hW/decaCCDB",{indexBy: 'CCID'});
    await db.load();
    console.log(await ipfs.swarm.peers())
    db.events.on('replicated', () => {
      this.setState({replicated_data:this.state.replicated_data+1})
      console.log("All database replicated");
    });
    const { id, agentVersion, protocolVersion } = await ipfs.id()
    this.setState({ id, agentVersion, protocolVersion })  
    return db
  }
  
  render () {
    const width = (this.state.replicated_data*100)/3720
    let load; 
    if(width>100){
      load = this.state.loading? <p>All data are replicated!</p>:
      <div>
      <p>All data are replicated!</p>
      <div className="progress">
          <div className="determinate" style={{width: width+'%'}}></div>
      </div>
    </div>
    }else{
      load = this.state.loading? <p>All data are replicated!</p>:
    <div>
      <p>Loading data...</p>
      <div className="progress">
          <div className="determinate" style={{width: width+'%'}}></div>
      </div>
    </div>
    }
                
    return (
      <form onSubmit={this.handleSubmit} className="valign row container" style={{ textAlign: 'center' }}>
        <div className="img-container">
          <img alt="deca-logo" id="logo" src="DC-1-Blanco.png"></img>
        </div>
        {load}
        <div className="input-field col s2">
            <select defaultValue={'1'} onChange={this.handleOption}>
              <option value="1">Category</option>
              <option value="2">CCID</option>
              <option value="3">SerialNo</option>
              <option value="4">Standard</option>
              <option value="5">Project Id</option>
              <option value="6">Vintage Start</option>
              <option value="7">Vintage End</option>
              <option value="8">Adquisition Recipt</option>
              <option value="9">Cancel Date</option>
            </select>
            <label>Search Parameter</label>
          </div>
          <button type="submit" className="hide">Submit</button>
        <div className="container input-field col s10">
          <input onChange={this.handleValue} type="text" id="autocomplete-input" className="autocomplete"></input>
          <label htmlFor="autocomplete-input">Equals To</label>
        </div>
        <div className="col s12">
          <p>Your ID is <strong>{this.state.id}</strong></p>
          <p>Your IPFS version is <strong>{this.state.agentVersion}</strong></p>
          <p>Your IPFS protocol version is <strong>{this.state.protocolVersion}</strong></p>
        </div>
        <div className="input-field col s6">
          <select name="selectOptions" multiple defaultValue={this.state.searchColumnsActive} onChange={this.handleColumns}>
          {Object.keys(this.state.searchColumns).map((item, i) => (
                <option value={i} key={i}>{ this.state.searchColumns[item]}</option>
            ))}
          </select>
          <label>Show Columns</label>
        </div>

        <table className="striped" >
          <thead>
            <tr>
            {Object.keys(this.state.searchColumnsActive).map((item, i) => (
                <th key={i}>{ this.state.searchColumns[this.state.searchColumnsActive[item]] }</th> 
            ))}
            </tr>
          </thead>
          <tbody>
        { 
          Object.keys(this.state.searchResult).map((item, i) => (
            <tr key={i}>
            {Object.keys(this.state.searchColumnsActive).map((item_x, i_x) => {
              var key_search=this.state.searchColumnsKey[this.state.searchColumnsActive[item_x]]
              if(key_search==='cancelPrice'){
                return(<td key={i_x} className="">{ this.state.searchResult[item][key_search].qty} { this.state.searchResult[item][key_search].divisa}</td>)
              }
              if(key_search==='conversionPrice'){
                return(
                <td key={i_x} className="">
                   <p>USD: { this.state.searchResult[item][key_search].USD}</p> 
                   <p>CNY: { this.state.searchResult[item][key_search].CNY}</p>
                   <p>EUR: { this.state.searchResult[item][key_search].EUR}</p>
                   <p>GBP: { this.state.searchResult[item][key_search].GBP}</p>
                </td>
                )
              }
              if(key_search==='conversionPriceCrypto'){
                return(
                <td key={i_x} className="">
                   <p>BTC: { this.state.searchResult[item]['conversionPrice'].BTC}</p>
                   <p>ETH: { this.state.searchResult[item]['conversionPrice'].ETH}</p>
                   <p>LTC: { this.state.searchResult[item]['conversionPrice'].LTC}</p>
                </td>
                )
              }
              if(key_search==='ccVintageStart' || key_search==='ccVintageEnd' || key_search==='cancelDate' || key_search==='issueDate'){
                return(
                <td key={i_x} className="">
                  { moment.unix(this.state.searchResult[item][key_search]).format("DD/MM/YYYY HH:mm") }
                </td>
                )
              }
              
              return(<td key={i_x} className="">{ this.state.searchResult[item][key_search] }</td>)
              })}
            </tr>
         ))
        }  
        </tbody>
        </table>
      </form>
    )
  }
}

export default App;
