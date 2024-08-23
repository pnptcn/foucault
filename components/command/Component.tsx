import * as React from "react"

export const Component = () => {
    const [open, setOpen] = React.useState(false)

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            console.log(e.key)
            if (e.key === "Escape") {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }

        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    return <></>
}

export default Component
