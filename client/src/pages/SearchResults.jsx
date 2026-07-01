import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

const SearchResult = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q');
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            const res = await axios.get(`http://localhost:5000/api/products/search?q=${query}`);
            setProducts(res.data);
        };
        fetchProducts();
    }, [query]);

    return (
        <div className="search-results">
            <h1>Search Results for: "{query}"</h1>
            <div className="product-grid">
                {products.map(p => (
                    <div key={p._id} className="product-card">
                        <h3>{p.name}</h3>
                        <p>₹{p.price}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SearchResult;