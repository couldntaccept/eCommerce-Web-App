import TopBar from '../components/TopBar';
import PhoneTable from '../components/PhoneTable';
import BrandFilter from '../components/BrandFilter';
import LoadingLine from '../components/LoadingLine';
import RangeSlider from '../components/RangeSlider';
import SoldoutPhoneList from '../components/SoldoutPhoneList';
import BestSellerPhoneList from '../components/BestSellerPhoneList';
import { useContext, useState, useEffect } from 'react';
import LoginContext from '../store/LoginContext';
import PhoneDialog from '../components/PhoneDialog';
import { useLocation } from 'react-router-dom';
import { set } from 'mongoose';



function Main() {
    //Defaults to the "Home state"
    const [State, setState] = useState("home")
    //SearchValue is for the search functionality. SearchedValue is used to show the "Matching Criteria" words
    const [SearchValue, setSearchValue] = useState("")
    const [SearchedValue, setSearchedValue] = useState("")
    //When search is complete, the data is stored in the SearchedPhoneData state
    const [SearchedPhoneData, setSearchedPhoneData] = useState([])
    //PriceRangeFilter is updated when the user releases the mouse on the rangeslider. This updates the phone table.
    const [PriceRangeFilter, setPriceRangeFilter] = useState([0, 0])
    //The dropdown filter is for the brands.
    const [DropdownFilter, setDropdownFilter] = useState([])
    let location = useLocation();

    //FilteredPhoneData stores the data after a filter has been applied.
    //We store the FilteredPhoneData in the Main page (and not the phonetable) because we have multiple filters.
    const [FilteredPhoneData, setFilteredPhoneData] = useState([])

    //For the dialog box & Item STate
    const [open, setOpen] = useState(false);
    const [RowData, setRowData] = useState();
    // For back button
    const [changeState, setChangeState] = useState(false);
    const loginctx = useContext(LoginContext);

    useEffect(() => {
        
        if(loginctx.LoginStatus === true && loginctx.lastOpen !== ''){
            handleOpen(loginctx.lastOpen)
            
        } else if (loginctx.LoginStatus === true && loginctx.lastOpen === ''){
            // do not open dialog
            
        } else if (loginctx.LoginStatus === false && loginctx.lastOpen !== ''){
            // open dialog
            
            handleOpen(loginctx.lastOpen)
            
        }
        
       
    }, [loginctx.LoginStatus, loginctx.lastOpen]);

    
    useEffect(() => {}, [loginctx.lastOpen]);

    const handleOpen = (row) => {
        setRowData(row);
        
        if (State === "home") {
            setState("homeitem");
            
        } else if (State === "search") {
            setState("searchitem");

        }
        setOpen(true)
    };

    const handleClose = () => {
       
        if (State === "searchstate") {
            setState("search")
           
        } else if (State === "homeitem") {
            setState("home")
           
        }
        setOpen(false)
        loginctx.setLastOpen('')
        
    };

    return (
        <div>
            <TopBar
                setState={setState}
                SearchValue={SearchValue}
                setSearchValue={setSearchValue}
                setSearchedValue={setSearchedValue}
                setSearchedPhoneData={setSearchedPhoneData}
            />

            {/*********** HOME STATE *********/}
            {
                (State === "home" || State === "homeitem") &&

                //Replace this with components
                <div>
                    <h1>Sold Out Soon</h1>
                    <h2>These phones are selling out fast!</h2>
                    <SoldoutPhoneList handleOpen={handleOpen} open={open} />
                    <h1>Best Sellers</h1>
                    <h2>These phones are the most popular!</h2>
                    <BestSellerPhoneList handleOpen={handleOpen} open={open} />
                </div>

            }
            {/********************************/}



            {/*********** SEARCH LOADING STATE *********/}
            {
                State === "loading" &&
                <div>

                    <h1>Searching...</h1>
                    <LoadingLine />

                </div>
            }
            {/********************************/}




            {/*********** SEARCH STATE *********/}

            {
                (State === "search" || State === "searchitem") &&
                <div>
                    <RangeSlider
                        setPriceRangeFilter={setPriceRangeFilter}
                        SearchedPhoneData={SearchedPhoneData}
                    />
                    <BrandFilter SearchedPhoneData={SearchedPhoneData} setDropdownFilter={setDropdownFilter} DropdownFilter={DropdownFilter} />
                    <div>
                        <p></p>
                        <b>{SearchedPhoneData.length} search result(s) found, displaying {FilteredPhoneData.length},
                            matching criteria:
                            {SearchedValue === "" ? false : " Title: '" + SearchedValue + "', "}
                            {" "}Price: ${PriceRangeFilter[0]} to ${PriceRangeFilter[1]}

                            {DropdownFilter.length === 0 ? false : " and Brand(s): " + DropdownFilter.join(", ")}

                            .</b>
                    </div>
                    <PhoneTable
                        SearchedPhoneData={SearchedPhoneData}
                        PriceRangeFilter={PriceRangeFilter}
                        FilteredPhoneData={FilteredPhoneData}
                        setFilteredPhoneData={setFilteredPhoneData}
                        DropdownFilter={DropdownFilter}
                        setState={setState}
                        handleOpen={handleOpen}
                        setRowData={setRowData}
                    />

                </div>

            }

            {/********************************/}

            {
                (State === "searchitem" || State === "homeitem") &&

                <PhoneDialog
                    //key={RowData.reviewerid}
                    open={open}
                    setOpen={setOpen}
                    handleClose={handleClose}
                    row={RowData}
                    State={State}
                />



            }

        </div>
    )
}

export default Main;