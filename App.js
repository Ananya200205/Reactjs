import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Main from './component/Main';
import CardList from './component/CardList';
import InsertForm from './component/InsertForm';
import DeletedCards from './component/DeletedCards';
import VisitedCards from './component/VisitedCards';

function App() {
  const [cards, setCards] = useState([]);
  const [deletedCards, setDeletedCards] = useState([]);
  const [visitedCards, setVisitedCards] = useState([]);

  useEffect(() => {
    const storedCards = JSON.parse(localStorage.getItem('cards')) || [];
    setCards(storedCards);

    const storedDeletedCards = JSON.parse(localStorage.getItem('deletedCards')) || [];
    setDeletedCards(storedDeletedCards);

    const storedVisitedCards = JSON.parse(localStorage.getItem('visitedCards')) || [];
    setVisitedCards(storedVisitedCards);
  }, []);

  const updateCardsInLocalStorage = (updatedCards) => {
    setCards(updatedCards);
    localStorage.setItem('cards', JSON.stringify(updatedCards));
  };

  const updateDeletedCardsInLocalStorage = (updatedDeletedCards) => {
    setDeletedCards(updatedDeletedCards);
    localStorage.setItem('deletedCards', JSON.stringify(updatedDeletedCards));
  };

  const updateVisitedCardsInLocalStorage = (updatedVisitedCards) => {
    setVisitedCards(updatedVisitedCards);
    localStorage.setItem('visitedCards', JSON.stringify(updatedVisitedCards));
  };

  const handleAddCard = (newCard) => {
    const updatedCards = [...cards, newCard];
    updateCardsInLocalStorage(updatedCards);
  };

  const handleDeleteCard = (index) => {
    const deletedCard = cards[index];
    const updatedCards = cards.filter((_, i) => i !== index);

    const updatedDeletedCards = [...deletedCards, deletedCard];

    updateCardsInLocalStorage(updatedCards);
    updateDeletedCardsInLocalStorage(updatedDeletedCards);
  };

  const handleVisitCard = (visitedCard) => {
    const updatedVisitedCards = [...visitedCards, visitedCard];
    const updatedCards = cards.filter((card) => card !== visitedCard);

    updateVisitedCardsInLocalStorage(updatedVisitedCards);
    updateCardsInLocalStorage(updatedCards);
  };

  const handleRestoreCardToCardList = (restoredCard) => {
    if (visitedCards.includes(restoredCard)) {
      const updatedVisitedCards = visitedCards.filter((card) => card !== restoredCard);
      setVisitedCards(updatedVisitedCards);
      localStorage.setItem('visitedCards', JSON.stringify(updatedVisitedCards));
    } else {
      const updatedDeletedCards = deletedCards.filter((card) => card !== restoredCard);
      setDeletedCards(updatedDeletedCards);
      localStorage.setItem('deletedCards', JSON.stringify(updatedDeletedCards));
    }
    setCards((prevCards) => [...prevCards, restoredCard]);
    localStorage.setItem('cards', JSON.stringify([...cards, restoredCard]));
  };

  const handleRestoreCard = (restoredCard) => {
    const updatedDeletedCards = deletedCards.filter((card) => card !== restoredCard);
    setDeletedCards(updatedDeletedCards);
    localStorage.setItem('deletedCards', JSON.stringify(updatedDeletedCards));

    setCards((prevCards) => [...prevCards, restoredCard]);
    localStorage.setItem('cards', JSON.stringify([...cards, restoredCard]));
  };

  const handleDeleteCardPermanently = (deletedCard) => {
    const updatedDeletedCards = deletedCards.filter((card) => card !== deletedCard);
    setDeletedCards(updatedDeletedCards);
    localStorage.setItem('deletedCards', JSON.stringify(updatedDeletedCards));
  };

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/insert" element={<InsertForm onAddCard={handleAddCard} />} />
          <Route
            path="/list"
            element={<CardList cards={cards} onDeleteCard={handleDeleteCard} onVisitCard={handleVisitCard} />}
          />
          <Route
            path="/deleted"
            element={
              <DeletedCards
                deletedCards={deletedCards}
                onRestoreCard={handleRestoreCard}
                onDeleteCardPermanently={handleDeleteCardPermanently}
              />
            }
          />
          <Route
            path="/visited"
            element={
              <VisitedCards
                visitedCards={visitedCards}
                onRestoreCardToCardList={handleRestoreCardToCardList}
                onDeleteCardPermanently={handleDeleteCardPermanently}
              />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
