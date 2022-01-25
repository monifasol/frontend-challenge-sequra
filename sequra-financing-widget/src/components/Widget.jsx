import { React, useState, useEffect } from 'react'
import axios from "axios"
import InformationBox from './InformationBox';


const Widget = ( {totalWithTax} ) => {

    const [ instalmentsOptions, setInstalmentsOptions ] = useState([])
    const [ monthlyFee, setMonthlyFee ] = useState("")
    const API_URI = process.env.REACT_APP_API_URL;
    const apiURL = `${API_URI}/credit_agreements?totalWithTax=${totalWithTax}`

    // Set InstalmentsOptions when component renders the first time
    useEffect( ()=> {

        axios
            .get(apiURL)
            .then((response) => {
                const instalmentsOpt = [...response.data]
                setInstalmentsOptions(instalmentsOpt)
                setMonthlyFee(instalmentsOpt[0].instalment_fee.string)      // first instalment as default (the one selected on the dropdown)
            })
            .catch((error) => {
                console.log(error)
            });

        return () => {
            // cleanup function
            setInstalmentsOptions([])
            setMonthlyFee("")
        }

    }, [totalWithTax, apiURL]);     // re-run when the price changes

    const getSelectedInstalment = () => {

        // Get current selected instalment option
        let instalmentCount = document.getElementById('selectInstalmentOpt').value

        // Filter through the instalmentsOptions to get the one the user selected
        return instalmentsOptions.filter( option => option.instalment_count.toString() === instalmentCount )[0]

    }

    const sendPostReqEventAPI = (typeEvent) => {

        const selectedInstalment = getSelectedInstalment()
        
        const bodyRequest = { 
            "context": "financingCostWidget", 
            "type": typeEvent, 
            "selectedInstalment": { 
                "instalment_count": selectedInstalment ? selectedInstalment.instalment_count : 0,
                "instalment_amount": selectedInstalment ? selectedInstalment.instalment_amount.value : 0,
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

        const typeEvent = popupIsOpened ? "moreInfoPopupOpened" : "moreInfoPopupClosed"
        sendPostReqEventAPI(typeEvent)
        togglePopup()
    }

    const handleChangeInstalmentOpt = () => {

        sendPostReqEventAPI("instalmentsOptionChanged")
        setMonthlyFee(getSelectedInstalment().instalment_fee.string)
    }

    const togglePopup = () => {

        const popup = document.getElementById('popupInfo')
        const overlay = document.getElementById("overlay")

        if (overlay) overlay.classList.toggle("show")
        if (popup) popup.classList.toggle("show")
        
    }

    return (
        <>
            <div className="popup" id="popupInfo" data-testid='popup'>
                <span className="close-popup" onClick={ () => handleEventPopup(false) }>x</span>
                <InformationBox monthlyFee={monthlyFee} /> 
            </div>

            <div className='instalments-box'>

                <span className="more-info" data-testid='moreInfoLink' onClick={ () => handleEventPopup(true) }>más info</span>

                <div className='instalments-box-select'>
                    <label htmlFor='selectInstalmentOpt'>Págalo en</label>
                    
                    <select className='instalments-options' id='selectInstalmentOpt' data-testid='selectInstalments' onChange={ (e) => handleChangeInstalmentOpt(e.target.value) }>
                        { instalmentsOptions.map( (option, i) => {
                            return (
                                <option value={option.instalment_count} key={i} data-testid="selectOption">
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
