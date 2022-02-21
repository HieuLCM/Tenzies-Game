import React, {useState, useEffect} from "react"
import Confetti from "react-confetti"
import "./style.css"
import Dice from"./Components/Dice.js"
import {nanoid} from "nanoid"


export default function App() {
    const [allDice, setAllDice] = useState(allNewDice())
    const [tenzies, setTenzies] = useState(false)
    const [size, setSize] = useState({width: window.innerWidth, height: window.innerHeight})
    const [numberRoll, setNumberRoll] = useState(0)
    const [isBest, setIsBest] = useState(false)

    if (!localStorage.getItem("best")) {localStorage.setItem("best", 100)}

    useEffect(() => {
        const allHeld = allDice.every(dice => dice.isHeld)
        const firstValue = allDice[0].value
        const sameValue = allDice.every(dice => dice.value === firstValue)

        if (allHeld && sameValue) {
            setTenzies(true)
            if (numberRoll <= localStorage.getItem("best")) {
                localStorage.setItem("best", numberRoll)
                setIsBest(true)
            }
        }
    }, [numberRoll,allDice])

    useEffect(() => {
        function resetSize() {
            setSize({width: window.innerWidth, height: window.innerHeight})
        }
        window.addEventListener("resize", resetSize)
        return () => {
            window.removeEventListener("resize", resetSize)
        }
    }, [])

    function allNewDice() {
        const newDice = []
        for (let i=0; i<10; i++) {
            newDice.push(generateNewDice())
        }
        return newDice
    }
    
    function generateNewDice() {
        return ({
            id: nanoid(),
            value: Math.ceil(Math.random()*6),
            isHeld: false
        })
    }

    function rollDice() {
        if (!tenzies) {
            setAllDice(prevAllDice => prevAllDice.map(dice => (
                dice.isHeld ? dice : generateNewDice()
            )))
            setNumberRoll(prevNum => prevNum +1)
        } else {
            setTenzies(false)
            setAllDice(allNewDice())
            setNumberRoll(0)
            setIsBest(false)
        } 
    }


    function holdDice(id) {
        setAllDice(prevAllDice => prevAllDice.map(dice => (
            dice.id === id ? {...dice, isHeld: !dice.isHeld} : dice
            )))
    }

    const diceElements = allDice.map(dice => (
            <Dice key={dice.id} value={dice.value} isHeld={dice.isHeld} handleClick={() => holdDice(dice.id)}/>
        ))

    return (
        <main>
            {tenzies && <Confetti width={size.width} height={size.height}/>}
            <h1 className="title">Tenzies</h1>
            <p className="instruction">Roll until all dice are the same. Click each dice to freeze it at its current value between rolls.</p>
            <div className="dice-container">
                {diceElements}
            </div>
            {tenzies && <div className="congrat">CONGRATULATIONS</div>}
            <button className="roll-dice" onClick={rollDice}>{tenzies ? "New Game": "Roll"}</button>
            {tenzies ? <span className="bestscore">{isBest ? "Best Score" : `You Won After ${numberRoll} Rolls`}</span> :
                <span className="roll-num">{numberRoll}</span> }
        </main>
    )
}