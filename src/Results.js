import React, {useState} from "react";
import Search from "./search.png";

export default function SearchJWords(){
    //states- input query, movies
    const [query, setQuery] = useState('');
    //create the state for movies, and update that state appropriate
    const [words, setWords] = useState([]);
    const [isLoading, setIsLoading] = useState(false)

    const nLvl = ["N1","N2","N3","N4","N5"]

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
        {/* Start of the container block, that is located in #root */}
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
                    //ŠĶĪET lens viss ir tpc ka vajag savu proxy uzkodet, jo tas ekstra links ir lens
                    
                    const [translations] = a.senses.map((b, index)=>{return(b.english_definitions.map(c=>{return(`${c}`)}))})
                    
                    const [reading] =  a.japanese.map( b=> { return(b.reading) })
                    
                    const [searchWord] = a.japanese.map( b=> { return(b.word) })

                    const jlpt = a.jlpt.map( b =>{ return(b !== "" && b.slice(-2).toUpperCase())})

                    const [wordType] = a.senses.map( b =>{
                        return(b.parts_of_speech.map(d => {
                            return(d)
                            }) 
                        )} 
                    )
                
// ------------------------------------search also poga

                    const seeAlso = a.senses.map( b =>{
                        return(b.see_also.map((c, index)=>{

                        // splits both values up and you can add second value in the [], to get the second item, if its not there, it returns as unindentified!
                        const [oneWord] = c.split(/(?<=^\S+)\s/)
                            console.log(oneWord)
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
                    //  test for N level gen.... ~10x wtf

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
{/*  Loops trough nLvl, which is just a pre-written variety of levels.. any jlpt level that is the same as the nLvl, active class is toggled*/}
                            <div className="jlpt-wrapper">
                                {
                                nLvl.map( (i, index) => 
                                    <div key={index} 
                                            className= {(
                                            jlpt[0] === i || 
                                            jlpt[1] === i || 
                                            jlpt[2] === i || 
                                            jlpt[3] === i || 
                                            jlpt[4] === i ? " current-level " : "")
                                            + " element-level row-1"}>
                                        {i}
                                    </div>
                                    )
                                }
                            </div>
{/* ------------------------------------------TRANSLATIONS --------------------------------------------------------- */}
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
{/* ------------------------------------------ BUTTON UP --------------------------------------------------------- */}
            {count > 1 && (
                <button className="switch-lang"
                    onClick={ e => scrollTop(scroll) }>
                    Scroll back to Search
                </button>
            )}
{/* End of the container block */}
        </>
    )
}
