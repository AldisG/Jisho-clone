import React, {useState} from "react";
import Search from "./search.png";

export default function SearchJWords(){
    //states- input query, movies
    const [query, setQuery] = useState('');
    //create the state for movies, and update that state appropriate
    const [words, setWords] = useState([]);
    const [isLoading, setIsLoading] = useState(false)
    const count = words.length
    // const canScroll = true
    const scroll = 0
    const url = `https://jisho.org/api/v1/search/words?keyword=%22${query}%22&`
    // const urlWithProxy = `https://cors-anywhere.herokuapp.com/https://jisho.org/api/v1/search/words?keyword=%22${query}%22&`
    
    const scrollTop = number => window.scrollTo({
            top: number,
            behavior: 'smooth'  
    });  
        
    const searchJWords = async e => {
        e.preventDefault();
        setIsLoading(true)
        
        try {
            const res = await fetch(url);
            const data = await res.json();
            const allData = data.data;
            
            // allData.length !== 0 ? setWords(allData,[]) : []
            setWords(allData,[])


            // console.log("Finished loading!")
            setIsLoading(false)
        }
        catch(err){console.log("WTF", err)}
        // scroll only when isnt in the right place
        window.scroll !== scroll && scrollTop(scroll)
    }
    
    const searchSentencesLink = link =>{
        console.log(link)
    }
    // vai šis nav labaks variants(ja animēšu) :
    // --- {a.is_common && <h5>(Is common)</h5>} ---
    // patreizējam "<h5>{a.is_common && "(Is common)"}</h5>"?????????/
    // console.log(words)
    return (
        <>
            <div className="search-block-container">
                <form onSubmit={searchJWords}>
                    <div className="search-block">
                        <h1>Japanese dictionary</h1>
                        <div className="search-jp-eng-search-container">
                            <div className="search-block-container">
                                <input  
                                    type="text" 
                                    name="query"
                                    placeholder="Search for a word..."
                                    value={query} 
                                    onChange={ e => setQuery(e.target.value)}
                                />
                                {/* <button type="button" className="search-btn"> ? </button> */}

                                <button className="search-btn"
                                    type="submit" 
                                    onClick={ e => (
                                    searchJWords,
                                    scrollTop(scroll)
                                    )}>
                                    {isLoading ? "Loading" : <img src={Search} className="search-icon" alt=""></img>}
                                </button>

                            </div>

                            <div className="lang-btn-container">
                                <button className="switch-lang english-btn active-lang">
                                    <div>EN</div>
                                </button>
                                <button className="switch-lang japanese-btn">
                                    <div>JP</div>
                                </button>
                            </div>
                        </div>

                    </div>
                </form>
            </div>
            {/* Shows how many search results -----------------------------------------*/}
            <p className="search-counter-p">
                { isLoading ? "Searching..." : (count === 0 ? "Search for something..." : count + " Search results") }
            </p>

            {/* CARD CODE ------------------------------------------------------------ */}
                
            {words.map((a, index)=>{
                    // (needs "return" to work)
                    //ŠĶĪET lens viss ir tpc ka vajag savu proxy uzkodet, jo tas ekstra links ir lens
                    
                    const [translations] = a.senses.map((b, index)=>{return(b.english_definitions.map(c=>{return(`${c}`)}))})
                    
                    const [reading] =  a.japanese.map( b=> { return(b.reading) })
                    
                    const [searchWord] = a.japanese.map( b=> { return(b.word) })
                    
                    // Neatgriez jaut zīmi ??????????????????????????????????????????????????????????????????????????
                    const jlpt = a.jlpt.map( b =>{ return(b !== "" ? b.slice(-2) : "adwdawdawdawd?")})
                    // const NNN = jlpt !== "" ? jlpt.length() -2 : ""
                    








                    const [wordType] = a.senses.map( b =>{
                        return(b.parts_of_speech.map(d => {
                            return(d)
                        }) )} )
                
// ------------------------------------search also poga

                    const seeAlso = a.senses.map( b =>{
                        return(b.see_also.map((c, index)=>{

                        // splits both values up and you can add second value in the [], to get the second item, if its not there, it returns as unindentified!
                        const [oneWord] = c.split(/(?<=^\S+)\s/)
                        // console.log(wordType)

                        // FOR SOME REASON THIS CODE RUNS 2x... the {c}

                    return(
                        <a key={index}
                                className="see-also-btn btn element-small"
                                href="#"
                                onClick={ e => {
                                    // (e) ir tas, kas šim kodam ļauj strādāt kā tieši attiecināt uz konkrēto elementu (ja lieto tik (c), tad viņš ņem visu sarakstu un nevar padot tekstu uz galveno search funkciju)
                                    const searchSeeAlso = e.target.value
                                    setQuery(searchSeeAlso)
                                    window.scroll !== scroll && scrollTop(scroll)
                                    
                                }}>
                                {oneWord}
                            </a>
                            
                        )} 
                        ))
                        }

                    )

// Here goes the mochup for cards -------------------------------------
                    return(
                    <div className="card">
                        <div key={index} className="card-container has-a-gap">

{/* ------------------------------------------KANJI & READING --------------------------------------------------------- */}
                            <div className="translation-container has-a-gap">

                                <div className="kanji element row-1">
                                    <div>{searchWord}</div>
                                </div>

                                <div className="reading element row-1">
                                    <div>[{reading}]</div>
                                </div>        
                            </div>        
                                
{/* ------------------------------------------COMMON & WORD TYPE --------------------------------------------------------- */}

                            <div className="common-type-container has-a-gap">
                                <div className="common element row-1">
                                    <div>{a.is_common ? "common" : "uncommon"}</div>
                                </div>

                                {/* Word type */}
                                <div className="word-type element row-1">
                                    <div>
                                        {wordType.map((x,i,arr) => (i < arr.length-1) ? (` ${x},`) : (` ${x}`))}
                                    </div>
                                </div>
                            </div>

{/* ------------------------------------------JLPT LEVELS --------------------------------------------------------- */}
{/*  needs to be adjusted -> if n5 => toggle class, code should be in className=" {code here...}>N1</div>" */}
                            <div className="jlpt-wrapper">
                                {/* {const NLevel = (jlpt.length -2)} */}
                                {console.log(jlpt)}
                                <div className="element-level row-1">N1</div>
                                <div className="element-level row-1">N2</div>
                                <div className="element-level row-1 current-level">N3</div>
                                <div className="element-level row-1">N4</div>
                                <div className="element-level row-1">N5</div>
                            </div>

                            {/* translations -------------------------------------------------*/}
                            <div className="meanings-wrapper element">
                                <h5>Translations:</h5>
                                <ul>
                                    {translations.map( (a, index) => <li key={index}>{index + 1}) {a}</li> )}    
                                </ul>
                            </div>
{/* ------------------------------------------SENTENCES --------------------------------------------------------- */}

                            <div className="sentences-wrapper element">
                                <b>Jisho.org</b> 
                                <br/>
                                <p>Sentences with: </p>
                                { searchWord !== undefined &&
                                    <a 
                                        href={`https://jisho.org/search/${searchWord}%20%23sentences`} 
                                        className="see-sentences-btn btn element-small">
                                        {searchWord}
                                    </a>
                                }

                            </div>
                        </div>
{/* ------------------------------------------SEARCH ALSO --------------------------------------------------------- */}

                        <div class="search-also element-small">
                            <b>See also:</b>
                            { seeAlso !== undefined && seeAlso}
                        </div>

                    </div>
                )
            } )
        }

            {/* Button up> */}
            {count > 1 && (
                <button className="button"
                    onClick={ e => scrollTop(scroll) }>
                    Scroll back to Search
                </button>
            )}
        </>
    )
}
