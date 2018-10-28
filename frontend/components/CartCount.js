import React from 'react'
import styled from 'styled-components'
import { TransitionGroup, CSSTransition } from 'react-transition-group'

const Dot = styled.div`
  background: ${props => props.theme.red};
  color: white;
  line-height: 2rem;
  min-width: 3rem;
  border-radius: 50%;
  padding: 0.5rem;
  margin-left: 1rem;
  font-weight: 400;
  font-feature-settings: "tnum";
  font-variant-numeric: tabular-nums;
`

const AnimationStyles = styled.span`
  position: relative;
  
  .count {
    display: block;
    position: relative;
    backface-visibility: hidden;
    transition: all 0.3s ease;
  }

  .count-enter {
    transform: rotateX(0.5turn)
  }

  .count-enter-active {
    transform: rotateX(0)
  }

  .count-exit {
    top: 0;
    position: absolute;
    transform: rotateX(0);
  }

  .count-exit-active {
    transform: rotateX(0.5turn);
  }
`

const CartCount = ({ count }) => (
  <AnimationStyles>
    <TransitionGroup>
      <CSSTransition
        unmountOnExit
        className="count"
        classNames="count"
        key={count}
        timeout={{ enter: 300, exit: 300 }}>
        <Dot>{count}</Dot>
      </CSSTransition>
    </TransitionGroup>
  </AnimationStyles>
)

export default CartCount
