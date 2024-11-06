const leitnerCode = `

function createStudyItem(flashCard) {
  return {
    id: Date.now() + Math.floor(Math.random() * 1123123123),
    cardId: flashCard.id,
    currentBoxIndex: 0,
    createdAt: Date.now(),
  };
}

const minBoxIndex = 0;
const maxBoxIndex = 8;

const leitnerSystem = (flashCards, studyCards) => {
  // state
  const reviewId = Date.now();
  let reviewHistory = [];

  let reviewStatus = "IN_PROGRESS";

  let currentCard = studyCards[0];
  let boxes = [
    [], // review immediately,
    [], // review every 10 mins
    [], // review every 1 hour
    [], // review every 1 day
    [], // review every 1 week
    [], // review every 1 month
    [], // review every 3 months
    [], // review every 6 months,
    [], // review every 1 year
  ];

  const getState = () => {
    return {
      boxes,
      reviewId,
      reviewHistory,
      currentCard,
      reviewStatus,
    };
  };

  const getNewCardState = (currentCard, answer) => {
    const flashCard = flashCards?.find(
      (card) => card.id === currentCard.cardId
    );
    if (!flashCard) {
      throw Error(\`Card with ${currentCard.cardId} not found\`);
    }

    if (answer === flashCard.answer) {
      const newIndex = Math.min(currentCard.currentBoxIndex + 1, maxBoxIndex);

      const newCardState = {
        ...currentCard,
        status: "correct",
        currentBoxIndex: newIndex,
        previousBoxIndex: currentCard.currentBoxIndex,
        updatedAt: Date.now(),
      };

      return newCardState;
    } else {
      const newIndex = Math.max(currentCard.currentBoxIndex - 1, minBoxIndex);

      const newCardState = {
        ...currentCard,
        currentBoxIndex: newIndex,
        previousBoxIndex: currentCard.currentBoxIndex,
        updatedAt: Date.now(),
        status: "incorrect",
      };
      return newCardState;
    }
  };

  const getNewBoxesState = (answer) => {
    const reviewedAt = Date.now();
    const newCardState = getNewCardState(currentCard, answer);

    const newReview = {
      reviewId,
      previousBoxIndex: currentCard.currentBoxIndex,
      newBoxIndex: newCardState?.currentBoxIndex,
      status: newCardState?.status,
      reviewedAt,
    };

    const newcardStateIndex = newCardState.currentBoxIndex;
    const previousBoxIndex = newCardState.previousBoxIndex;

    const newBoxes = boxes.map((box, idx) => {
      if (previousBoxIndex === 0) {
        if (idx === newcardStateIndex) {
          return box.concat(newCardState);
        }
      }

      if (idx === previousBoxIndex) {
        return box.filter((item) => item?.id !== newCardState?.id);
      }

      return box;
    });

    return {
      newBoxes,
      newReview,
    };
  };

  const update = (answer) => {
    const { newBoxes: newBoxesState, newReview } = getNewBoxesState(answer);

    const currentCardIndex = studyCards?.findIndex(
      (item) => item?.id === currentCard?.id
    );

    let nextCard = studyCards?.[currentCardIndex + 1];

    if (!nextCard) {
      nextCard = newBoxesState[0]?.[0];
    }

    if (!nextCard) {
      boxes = newBoxesState;
      currentCard = null;
      reviewStatus = "DONE";
      reviewHistory.push(newReview);

      return;
    }

    boxes = newBoxesState;
    currentCard = nextCard;
    reviewHistory.push(newReview);
  };
  return {
    getState,
    update,
  };
};
`;

const leitner = {
  id: "leitner",
  code: leitnerCode,
};

module.exports = {
  leitner,
};
