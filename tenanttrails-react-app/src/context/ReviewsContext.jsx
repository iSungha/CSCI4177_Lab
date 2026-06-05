import { createContext, useContext, useEffect, useState } from "react";
import { initialReviews } from "../data/mockData";

const ReviewsContext = createContext();
const REVIEWS_KEY = "tenanttrails_reviews";

function loadReviews() {
  const savedReviews = localStorage.getItem(REVIEWS_KEY);

  if (savedReviews) {
    return JSON.parse(savedReviews);
  }

  localStorage.setItem(REVIEWS_KEY, JSON.stringify(initialReviews));
  return initialReviews;
}

export function ReviewsProvider({ children }) {
  const [reviews, setReviews] = useState(loadReviews);

  useEffect(() => {
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
  }, [reviews]);

  function addReview(review) {
    const newReview = {
      ...review,
      id: Date.now(),
      date: new Date().toISOString().slice(0, 10),
    };

    setReviews((currentReviews) => [newReview, ...currentReviews]);
  }

  function deleteReview(reviewId) {
    setReviews((currentReviews) =>
      currentReviews.filter((review) => review.id !== reviewId)
    );
  }

  return (
    <ReviewsContext.Provider value={{ reviews, addReview, deleteReview }}>
      {children}
    </ReviewsContext.Provider>
  );
}

export function useReviews() {
  return useContext(ReviewsContext);
}