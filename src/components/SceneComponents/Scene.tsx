import React, { useCallback } from 'react'
import { Environment, OrbitControls } from '@react-three/drei'
import Board from './Board/Board'
import { Canvas } from '@react-three/fiber'
import { useAppDispatch, useAppSelector } from '../../store/store'
import { Square } from 'chess.js'
import { chess, getAvailableMoves, setSelectCell, updateBoard } from '../../store/boardSlice'
import styles from './Scene.module.css'

const Scene = () => {

    const dispatch = useAppDispatch()
    const { board, figures, selectedCell, availableMoves } = useAppSelector(state => state.game)

    const onCellSelect = useCallback((cell: Square) => {
      dispatch(setSelectCell(cell))
      dispatch(getAvailableMoves(chess.moves({ square: cell, verbose: true, legal: true })))
    }, [dispatch])

    const onFigureMove = useCallback((target: Square) => {
      if (selectedCell) {
        chess.move({ from: selectedCell, to: target, promotion: 'q' })
        dispatch(updateBoard())
      }
    }, [selectedCell, dispatch])

    return (
      <main className={styles.scene}>
        <Canvas camera={{ fov: 90, position: [6, 4, 4] }}>
          <directionalLight
            position={[1, 10, 10]}
            intensity={3.5}
          />
          <OrbitControls autoRotate={true} autoRotateSpeed={0.1} enablePan={false} minDistance={4} maxDistance={10}/>
          <Environment preset='sunset' background />
          <Board
            board={board}
            figures={figures}
            selectedCell={selectedCell}
            onCellSelect={onCellSelect}
            availableMoves={availableMoves}
            onFigureMove={onFigureMove} />
        </Canvas>
      </main>
    )
  }

  export default Scene