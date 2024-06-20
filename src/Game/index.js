import React, {Component} from 'react'
import './index.css'

class Game extends Component {
  constructor(props) {
    super(props)
    this.state = {
      score: 0,
      timeLeft: 60,
      selectedCategory: 'FRUIT',
      randomImage: props.imagesList[0].imageUrl,
      gameStatus: 'PLAYING',
    }
  }
  componentDidMount() {
    this.startTimer()
  }

  componentWillUnmount() {
    clearInterval(this.timerId)
  }

  getRandomImage = (imagesList, category) => {
    const filteredImages = imagesList.filter(
      image => image.category === category,
    )
    const randomIndex = Math.floor(Math.random() * filteredImages.length)
    return filteredImages[randomIndex].imageUrl
  }

  startTimer = () => {
    this.timerId = setInterval(() => {
      this.setState(
        prevState => ({
          timeLeft: prevState.timeLeft - 1,
        }),
        () => {
          if (this.state.timeLeft === 0) {
            clearInterval(this.timerId)
            this.setState({gameStatus: 'GAME_OVER'})
          }
        },
      )
    }, 1000)
  }

  onClickTabBtn = category => {
    this.setState({
      selectedCategory: category,
      randomImage: this.getRandomImage(this.props.imagesList, category),
    })
  }

  onClickThumbnail = id => {
    const {randomImage} = this.state
    const {imagesList} = this.props

    const clickedImage = imagesList.find(img => img.id === id)

    if (clickedImage && randomImage === clickedImage.imageUrl) {
      this.setState(prevState => ({
        score: prevState.score + 1,
        randomImage: this.getRandomImage(
          imagesList,
          prevState.selectedCategory,
        ),
      }))
    } else {
      clearInterval(this.timerId)
      this.setState({gameStatus: 'GAME_OVER'})
    }
  }

  onClickBtn = () => {
    clearInterval(this.timerId)
    this.setState(
      {
        score: 0,
        timeLeft: 60,
        selectedCategory: 'FRUIT',
        randomImage: this.props.imagesList[0].imageUrl,
        gameStatus: 'PLAYING',
      },
      this.startTimer,
    )
  }

  render() {
    const {score, timeLeft, randomImage, selectedCategory, gameStatus} =
      this.state
    const {tabsList, imagesList} = this.props

    const filteredImages = imagesList.filter(
      image => image.category === selectedCategory,
    )

    return (
      <div className="app-container">
        <ul className="header-container">
          <li>
            <img
              className="website-logo"
              src="https://assets.ccbp.in/frontend/react-js/match-game-website-logo.png"
              alt="website logo"
            />
          </li>
          <li className="timer-score-container">
            <p className="score-text">
              Score: <span className="score-value">{score}</span>
            </p>
            <img
              className="timer-logo"
              src="https://assets.ccbp.in/frontend/react-js/match-game-timer-img.png"
              alt="timer logo"
            />
            <p className="timer-text">{timeLeft} Sec</p>
          </li>
        </ul>

        {gameStatus === 'PLAYING' && (
          <>
            {randomImage && (
              <img className="randomImage" src={randomImage} alt="match" />
            )}
            <ul className="tabs-container">
              {tabsList.map(tab => (
                <li key={tab.tabId}>
                  <button
                    type="button"
                    className={
                      selectedCategory === tab.tabId
                        ? 'active-tab-text'
                        : 'tab-text'
                    }
                    onClick={() => this.onClickTabBtn(tab.tabId)}
                  >
                    {tab.displayText}
                  </button>
                </li>
              ))}
            </ul>
            <ul className="images-container">
              {filteredImages.map(img => (
                <li key={img.id}>
                  <button onClick={() => this.onClickThumbnail(img.id)}>
                    <img
                      className="thumbnail"
                      src={img.thumbnailUrl}
                      alt="thumbnail"
                    />
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}

        {gameStatus === 'GAME_OVER' && (
          <div className="game-over-container">
            <img
              className="trophy-img"
              src="https://assets.ccbp.in/frontend/react-js/match-game-trophy.png"
              alt="trophy"
            />
            <div className="text-score-container">
              <p className="your-score-text">Your Score</p>
              <h1 className="your-score">{score}</h1>
            </div>
            <button
              type="button"
              className="play-again"
              onClick={this.onClickBtn}
            >
              <span>
                <img
                  className="reset-logo"
                  src="https://assets.ccbp.in/frontend/react-js/match-game-play-again-img.png"
                  alt="reset"
                />
              </span>
              PLAY AGAIN
            </button>
          </div>
        )}
      </div>
    )
  }
}

export default Game
