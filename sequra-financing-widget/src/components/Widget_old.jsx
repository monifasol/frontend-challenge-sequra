import { React, useState, useEffect } from 'react'
import axios from "axios"
import InformationBox from './InformationBox';

const API_URI = process.env.REACT_APP_API_URL;

const Widget = () => {

    let totalWithTax = 15000   // Price (testing value)
    const [ instalmentsOptions, setInstalmentsOptions ] = useState([])
    const [ selectedInstalment, setSelectedInstalment ] = useState(null)
    const [ monthlyFee, setMonthlyFee ] = useState("")

    // When the component renders firt time, we set the InstalmentOptions
    useEffect( ()=> {
        const apiURL = `${API_URI}/credit_agreements?totalWithTax=${totalWithTax}`
        axios
            .get(apiURL)
            .then((response) => {
                const instalmentsOpt = [...response.data]
                setInstalmentsOptions(instalmentsOpt)
                setSelectedInstalment(instalmentsOpt[0])
                setMonthlyFee(instalmentsOpt[0].instalment_fee.string)      // by default, first instalment option (the one selected on the dropdown)
            })
            .catch((error) => {
                console.log(error)
            });
    }, [totalWithTax]);     // runs when the price (totalWithTax) changes

    const getSelectedInstalment = (instalmentCount) => {
        // Filter through the instalmentsOptions to get the one the user selected. 
        return instalmentsOptions.filter( option => option.instalment_count.toString() === instalmentCount )[0]
    }

    const sendPostReqEventAPI = (typeEvent) => {

        //let instalmentCount = document.getElementById('selectInstalmentOpt').value
        //let selectedInstalment = getSelectedInstalment(instalmentCount)

        console.log("Current statement in state: ", selectedInstalment.instalment_count)

        const bodyRequest = { 
            "context": "financingCostWidget", 
            "type": typeEvent, 
            "selectedInstalment": { 
                "instalment_count": selectedInstalment.instalment_count,
                "instalment_amount": selectedInstalment.instalment_amount.value,
            }
        }        
        axios
            .post(`${API_URI}/events`, { bodyRequest })
            .then((response) => {
                console.log(`POST request successful with response: ${response.status}`)
                console.log("Tracking info: POST request information sent to events API: ", bodyRequest)
            })
            .catch((error) => {
                console.log(`POST request unsuccessful, error: ${error}`)
            });
    }

    const handleEventPopup = (popupIsOpened) => {
        // open popup
        togglePopup()

        // Send event to events API
        const typeEvent = popupIsOpened ? "moreInfoOpened" : "moreInfoClosed"
        sendPostReqEventAPI(typeEvent)
    }

    const showMeLogs = () => {
        console.log("selected Instalment after update state, now YES: ", selectedInstalment)
    }


    const handleChangeInstalmentOpt = (instalmentCount) => {

        console.log("instalmentCount:", instalmentCount)
        const instalmentOpt = getSelectedInstalment(instalmentCount)

        // Update state variables selectedInstalment and monthlyFee
        // To re-create the state, need to clone the Object with Object.assign
        const cloneInstalmentOpt =  Object.assign({}, instalmentOpt);        
        setSelectedInstalment(cloneInstalmentOpt, showMeLogs())
        setMonthlyFee(cloneInstalmentOpt.instalment_fee.string)

        // IT DOES NOT RE-CREATE THE STATE :-((((((((( 
        // HUGE DOUBT IN REACT: if the state variable is a String, it DOES recreate the state. 
        // There's some behaviour I don't understand or master, with state variables that are OBJECTS.

        console.log("selectedInst in state: ", selectedInstalment.instalment_count)

        // Send event to events API
        const typeEvent = "instalmentsOptionChanged"
        sendPostReqEventAPI(typeEvent)
    }

    let overlay = document.getElementById("overlay")
    let popup = document.getElementById('popupInfo')

    const togglePopup = () => {
        popup.classList.toggle("show")
        overlay.classList.toggle("show")
    }

    return (
        <>


            <div className="popup" id="popupInfo">
                <span className="close-popup" onClick={ () => handleEventPopup(false) }>x</span>
                <InformationBox monthlyFee={monthlyFee} /> 
            </div>

            <div className='instalments-box'>

                <span className="more-info" onClick={ () => handleEventPopup(true) }>más info</span>

                <div className='instalments-box-select'>
                    <label>Págalo en</label>
                    

                    <select className='instalments-options' onChange={ (e) => handleChangeInstalmentOpt(e.target.value) }>
                        
                        { instalmentsOptions.map( (option, i) => {
                            return (
                                <option value={option.instalment_count} key={i}>
                                    {`${option.instalment_count} cuotas de ${option.instalment_amount.string}/mes`}
                                </option>
                            )
                        }) }                               
                    </select>
                </div>
            </div>

        </>
        
    )
}

export default Widget
