import React, { useState } from "react"

export const Search: React.FC = () => {
    const [query, setQuery] = useState("")
    const [results, setResults] = useState([])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const response = await fetch(`http://localhost:5050/search`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ query: query })
        })

        if (!response.ok) {
            throw new Error("Network response was not ok")
        }

        setResults(await response.json())
    }

    return <form onSubmit={handleSubmit}></form>
}

export default Search
