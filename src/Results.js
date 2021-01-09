import React, {useState} from "react";
import Search from "./search.png";

export default function SearchJWords(){
    //states- input query, movies
    const [query, setQuery] = useState('');
    //create the state for movies, and update that state appropriate
    const [words, setWords] = useState([]);
    const [isLoading, setIsLoading] = useState(false)
    const count = words.length
    const canScroll = true
    const [smallScroll, largeScroll] = [200, 310]
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
        window.scroll !== largeScroll && scrollTop(largeScroll)
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
                                    scrollTop(largeScroll)
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

            {/* Shows how many search results */}
            <p className="search-counter-p">{ count === "0" ? "Search for something..." : count + " Search results" } </p>
            {/* <p className="search-counter-p"> <b>{count}</b> search results</p> */}
            
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
                                // value={oneWord}
                                // type="text"
                                
                                onClick={ e => {
                                    // (e) ir tas, kas šim kodam ļauj strādāt kā tieši attiecināt uz konkrēto elementu (ja lieto tik (c), tad viņš ņem visu sarakstu un nevar padot tekstu uz galveno search funkciju)
                                    const searchSeeAlso = e.target.value
                                    setQuery(searchSeeAlso)
                                    window.scroll !== largeScroll && scrollTop(largeScroll)
                                    
                                }}>
                                {oneWord}
                            </a>
                            
                        )} 
                        ))
                        }

                    )
                    // Here goes the mochup
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
                                
{/* ------------------------------------------COMMON % WORD TYPE --------------------------------------------------------- */}

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

                            <div className="jlpt-wrapper">
                                {/* {const NLevel = (jlpt.length -2)} */}
                                {console.log(jlpt)}
                                <div className="element-level row-1">{jlpt}</div>
                                <div className="element-level row-1">{jlpt}</div>
                                <div className="element-level row-1 current-level">{jlpt}</div>
                                <div className="element-level row-1">{jlpt}</div>
                                <div className="element-level row-1">{jlpt}</div>
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
                    onClick={ e => scrollTop(smallScroll) }>
                    Scroll back to Search
                </button>
            )}


                    
{/* <hr/>
                <div className="card">

                    <div className="card-container has-a-gap">
                        <div className="translation-container has-a-gap">
                            <div className="kanji element row-1">
                                <div>犬犬犬</div>
                            </div>
                            <div className="reading element row-1">
                                <div>いぬ</div>
                            </div>                 
                        </div>

                        <div className="common-type-container has-a-gap">
                            <div className="common element row-1">
                                <div>common word</div>
                            </div>
                            <div className="word-type element row-1">
                                <div>noun, suru verb</div>
                            </div>
                        </div>

                        <div className="jlpt-wrapper">
                            <div className="element-level row-1">N1</div>
                            <div className="element-level row-1">N2</div>
                            <div className="element-level row-1 current-level">N3</div>
                            <div className="element-level row-1">N4</div>
                            <div className="element-level row-1">N5</div>
                        </div>
                        
                        <div className="meanings-wrapper element">
                            <h5>Translations:</h5>
                            <ul>
                                <li>1 Meaning dogMeaning dog Meaning dogMeaning dogMeaning dogMeaning dogMeaning dogMeaning dogMeaning dogMeaning dogMeaning dogMeaning dog</li>
                                <li>2 Meaning Dog 2</li>
                                <li>3 Meaning dog 3</li>
                                <li>3 Meaning dog 3</li>
                                <li>3 Meaning dog 3</li>
                            </ul>
                        </div>
                        <div className="sentences-wrapper element">
                            <b>Jisho.org</b> 
                            <br/>
                            <p>Sentences with: </p>
                            <a href="#" className="see-sentences-btn btn element-small">
                                bouken
                            </a>  
                        </div>
                    </div>

                    <div className="search-also element-small">
                        <b>See also:</b>
                        <a href="#" className="see-also-btn btn element-small">Dog 1</a>
                        <a href="#" className="see-also-btn btn element-small">Dog 2</a>
                    </div>

                </div> */}
                        {/* {
                            count > 1 && (
                                <button className="button"
                                    onClick={ e => scrollTop(smallScroll) }>
                                    Scroll back to Search
                                </button>
                            )
                        } */}

        </>
    )
}



// <div className="body">
//             <form className="search-block-container" onSubmit={searchJWords}>
//                 <p className="search-counter-p">
//                     {count === 0 ? (isLoading ? "Loading.." : "Search a word") : (isLoading ? "Loading.." : "Search something else?")}
//                 </p>

//                 {/* <label className="label" htmlFor="query">Search for...</label> */}

//                 <input className="input" 
//                     type="text" 
//                     name="query"
//                     placeholder="Search for a word..."
//                     value={query} 
//                     onChange={ e => setQuery(e.target.value)}
//                 />
                
//                 <button className="search-btn"
//                     type="submit" 
//                     onClick={ e => (
//                         searchJWords,
//                         scrollTop(largeScroll)
//                     )}>
//                     {isLoading ? "Searching.." : "Search"}
//                  </button>

//                 <p className="search-counter-p"> <b>{count}</b> search results</p>

//                 {words.map((a, index)=>{
//                     // (needs "return" to work)
//                     //ŠĶĪET lens viss ir tpc ka vajag savu proxy uzkodet, jo tas ekstra links ir lens
                    
//                     const [translations] = a.senses.map((b, index)=>{return(b.english_definitions.map(c=>{return(`${c}`)}))})
                    
//                     const [reading] =  a.japanese.map( b=> { return(b.reading) })
                    
//                     const [searchWord] = a.japanese.map( b=> { return(b.word) })
                    
//                     const jlpt = a.jlpt.map( b =>{ return(b !== "" ? `[${b}]` : "?")})
                    
//                     const [wordType] = a.senses.map( b =>{
//                         return(b.parts_of_speech.map(d => {
//                             return(d)
//                         }) )} )
                
// ------------------------------------search also poga

//                     const seeAlso = a.senses.map( b =>{return(b.see_also.map((c, index)=>{

//                             // splits both values up and you can add second value in the [], to get the second item, if its not there, it returns as unindentified!
//                             const [oneWord] = c.split(/(?<=^\S+)\s/)
//                             // console.log(wordType)

//                             // FOR SOME REASON THIS CODE RUNS 2x... the {c}
//                         return(
//                         <div key={index}>
//                         <button 
//                             className="search-also"
//                             value={oneWord}
//                             type="text"
                            
//                             onClick={ e => {
//                                 // (e) ir tas, kas šim kodam ļauj strādāt kā tieši attiecināt uz konkrēto elementu (ja lieto tik (c), tad viņš ņem visu sarakstu un nevar padot tekstu uz galveno search funkciju)
//                                 const searchSeeAlso = e.target.value
//                                 setQuery(searchSeeAlso)
                                
//                                 window.scroll !== largeScroll && scrollTop(largeScroll)
//                             }}>
//                             {oneWord}
//                         </button>
                            
//                         </div>
//                     )} )) })
                    
//                     return(
//                         <div key={index}>
                        
//                             <h1>{searchWord}</h1>
//                             <h3>[{reading}]</h3>
                            
//                             <h4>
//                                 Word type: {wordType.map(
//                                         (x,i,arr) => (i < arr.length-1) ? (` ${x},`) : (` ${x}`))
//                                     }
//                             </h4>
                            
//                             <h5>{a.is_common && "(Is common)"}</h5>
//                             <p>{jlpt}</p> 
                             
//                             { seeAlso !== [] && (<div>{seeAlso}</div>) }
                            
//                             <a href={`https://jisho.org/search/${searchWord}%20%23sentences`}>
//                                 Search sentences with: {searchWord}
//                             </a>
//                             <ul>
//                                 {translations.map( (a, index) => <li key={index}>{a}</li> )}
//                             </ul>
//                         </div>
//                 )} )}
//             </form>
//             {count > 1 && (
//                 <button className="button"
//                     onClick={ e => scrollTop(smallScroll) }>
//                     Scroll back to Search
//                 </button>
//             )}

//         </div>
