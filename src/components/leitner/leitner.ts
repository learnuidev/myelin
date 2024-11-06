// Leitner System

type FlashCard = ListeningOptionsFlashCard | SimpleQuestionAnswerFlashCard;

interface BaseFlashCard {
  id: string;
  title: string;
  type: string;
}

interface ListeningOptionsFlashCard extends BaseFlashCard {
  type: "listening:options";
  audioUrl: string;
  options: Array<{
    id: string;
    imageUrl: string;
  }>;
  answer: string;
}

interface SimpleQuestionAnswerFlashCard extends BaseFlashCard {
  type: "question-answer:simple";
  answer: number | string; // Assuming the answer can be either a number or a string
}

interface StudyCard {
  id: number;
  cardId: string | number; // Assuming flashCard.id could be string or number
  currentBoxIndex: number;
  previousBoxIndex: number;
  createdAt: number;
  status?: string;
}

function createStudyCard(flashCard: FlashCard): StudyCard {
  return {
    id: Date.now() + Math.floor(Math.random() * 1123123123),
    cardId: flashCard.id,
    currentBoxIndex: 0,
    previousBoxIndex: 0,
    createdAt: Date.now(),
  };
}

const minBoxIndex = 0;
const maxBoxIndex = 8;

const oneSecondInMilliSeconds = 1000;
const oneMinuteInMilliSeconds = oneSecondInMilliSeconds * 60;
const oneHourInMulliSeconds = oneMinuteInMilliSeconds * 60;
const oneDayInMilliseconds = oneHourInMulliSeconds * 24;

const indexToTime: Record<number, number> = {
  0: 0,
  1: oneMinuteInMilliSeconds * 10,
  2: oneHourInMulliSeconds,
  3: oneDayInMilliseconds,
  4: oneDayInMilliseconds * 7,
  5: oneDayInMilliseconds * 30,
  6: oneDayInMilliseconds * 90,
  7: oneDayInMilliseconds * 180,
  8: oneDayInMilliseconds * 365,
};

const leitnerSystem = (flashCards: FlashCard[], studyCards: StudyCard[]) => {
  // state
  const reviewId = Date.now();
  let reviewHistory: any = [];

  let reviewStatus = "IN_PROGRESS";

  let currentCard: StudyCard = studyCards[0];
  let boxes: StudyCard[][] = [
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

  const getNewCardState = (currentCard: StudyCard, answer: any): StudyCard => {
    const flashCard = flashCards?.find(
      (card) => card.id === currentCard.cardId
    );
    if (!flashCard) {
      throw Error("Card with " + currentCard.cardId + " not found");
    }

    if (answer === flashCard.answer) {
      const newIndex = Math.min(currentCard.currentBoxIndex + 1, maxBoxIndex);

      const newCardState = {
        ...currentCard,
        status: "correct",
        currentBoxIndex: newIndex,
        nextReviewDate: Date.now() + indexToTime?.[newIndex],
        previousBoxIndex: currentCard.currentBoxIndex,
        updatedAt: Date.now(),
      };

      return newCardState;
    } else {
      const newIndex = Math.max(currentCard.currentBoxIndex - 1, minBoxIndex);

      const newCardState = {
        ...currentCard,
        currentBoxIndex: newIndex,
        nextReviewDate: Date.now() + indexToTime?.[newIndex],
        previousBoxIndex: currentCard.currentBoxIndex,
        updatedAt: Date.now(),
        status: "incorrect",
      };
      return newCardState;
    }
  };

  const getNewBoxesState = (answer: string) => {
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

  const update = (answer: any) => {
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
      // @ts-ignore
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

const flashCards: FlashCard[] = [
  {
    id: "b456be95-f964-442f-9e69-9f4762825df4",
    title: "Choose the correct picture",
    type: "listening:options",
    audioUrl: "https://www.mandarino.io/audio.mp3",
    options: [
      {
        id: "apple",
        imageUrl: "Apple",
      },
      {
        id: "tomato",
        imageUrl: "Tomato",
      },
    ],
    answer: "tomato",
  },
  {
    id: "b456be95-f964-442f-9e69-9f4762825df5",
    type: "question-answer:simple",
    title: "Secret of life",
    answer: 42,
  },
];

const studyDecks = [
  createStudyCard(flashCards[0]),
  createStudyCard(flashCards[1]),
];

const newLeitnerSystem = leitnerSystem(flashCards, studyDecks);

console.log("INIT", newLeitnerSystem.getState());

newLeitnerSystem.update("tomato");
console.log("1", newLeitnerSystem.getState());
newLeitnerSystem.update(41);
console.log("2", newLeitnerSystem.getState());
newLeitnerSystem.update(42);
console.log("3", newLeitnerSystem.getState());
