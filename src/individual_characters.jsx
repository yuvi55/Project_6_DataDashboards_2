import React, { useState, useEffect } from "react";
import md5 from "blueimp-md5";
import { useParams } from "react-router-dom";

function Individual_data() {
    const { id } = useParams();
    const publickey = 'b1cb39551462c02e72cf7011300cc810';
    const privatekey = '74d6dc2edc5050ac36918bd6f61f926fb8de092d';
    const ts = 2;
    const stringToHash = ts + privatekey + publickey;
    const hash = md5(stringToHash);
    const baseUrl = `https://gateway.marvel.com:443/v1/public/comics/${id}?ts=${ts}&apikey=${publickey}&hash=${hash}`;

    const [data, setData] = useState({}); // Use an object for initial state

    useEffect(() => {
        async function get_api_data() {
            try {
                let response = await fetch(baseUrl);
                if (response.ok) {
                    const result = await response.json();
                    setData(result.data.results[0]); // Set the first result to state
                } else {
                    throw ('Failed to fetch data');
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        get_api_data();
    }, [baseUrl]); // Include baseUrl as a dependency to re-fetch when the ID changes

    return (
        <>
            <h1>{data.title}</h1>

            {Object.keys(data).length > 0 && (
                <div className="individual_card">
                    <img className="comic_thumbnail" src={`${data.thumbnail.path}.${data.thumbnail.extension}`} alt="Thumbnail" />
                    <h3>Issue Number: {data.issueNumber}</h3>
                    <h3>Description: {data.description}</h3>
                    <h3>Format: {data.format || 'Not available'}</h3>
                    <h3>Page Count: {data.pageCount || 'Not available'}</h3>
                    <h3>ISBN: {data.isbn || 'Not available'}</h3>
                    <h3>UPC: {data.upc || 'Not available'}</h3>
                    <h3>Diamond Code: {data.diamondCode || 'Not available'}</h3>
                    <h3>Modified: {data.modified}</h3>
                    <h3>Resource URI: {data.resourceURI}</h3>
                    <h3>Series: {data.series ? data.series.name : 'Series not available'}</h3>
                    <h3>Creators:</h3>
                    <ul>
                        {data.creators && data.creators.items.map((creator, index) => (
                            <li key={index}>{creator.name} - {creator.role}</li>
                        ))}
                    </ul>
                    <h3>Characters:</h3>
                    <ul>
                        {data.characters && data.characters.items.map((character, index) => (
                            <li key={index}>{character.name}</li>
                        ))}
                    </ul>
                    {/* Add more fields as needed */}
                </div>
            )}
        </>
    );
}

export default Individual_data;
