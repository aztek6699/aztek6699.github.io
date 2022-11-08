import './Polysphere.css';

import { useState } from 'react';

import { NavigationBar } from '../components/NavigationBar';

import {
  Box, Grid,
  Typography,
  IconButton, Tooltip,
} from '@mui/material';

import {
  PlayCircleFilled as PlayCircleFilledIcon,
  Backspace as BackspaceIcon
} from '@mui/icons-material';

import { blocks } from '../data/polyspheres';

const ROWS = 5;
const COLUMNS = 11;

const DEFAULT_BOARD = Array(ROWS).fill([...Array(COLUMNS).fill(0)]);
const DEFAULT_BLOCKS_PLACED = Array(blocks.length).fill(false);

export const Polysphere = () => {

  const [board, setBoard] = useState(DEFAULT_BOARD);
  const [blocksPlaced, setBlocksPlaced] = useState(DEFAULT_BLOCKS_PLACED)

  const [hoverCells, setHoverCells] = useState([]);

  const [selectedBlock, setSelectedBlock] = useState(0);

  const clearBoard = () => {
    setBoard(DEFAULT_BOARD);
    setBlocksPlaced(DEFAULT_BLOCKS_PLACED);
    setSelectedBlock(0);
  }

  const startFittingBlocksInBoard = () => {
    let availableBlockIDs = [];
    blocksPlaced.forEach((block, index) => {
      if (!block) {
        availableBlockIDs.push(index)
      }
    });

    console.log(availableBlockIDs);
  }

  const getCellColor = (blockID) => {
    const filteredBlocks = blocks.filter(block => block.id === parseInt(blockID));
    if (filteredBlocks.length === 1) {
      return filteredBlocks[0].color;
    }

    return "";
  }

  const addHoverCells = position => {
    setHoverCells([]);
    if (board[position[0]][position[1]] === 0) {
      const filteredBlocks = blocks.filter(block => block.id === selectedBlock);

      if (filteredBlocks.length === 1) {
        const block = filteredBlocks[0];
        const blockPositionInBoard = block.layout.map(cell => [cell[0]+position[0], cell[1]+position[1]]);

        let canPosition = true;
        blockPositionInBoard.forEach(cell => {

          if (cell[0] < 0 || cell[0] >= ROWS || cell[1] < 0 || cell[1] >= COLUMNS) {
            canPosition = false;
          }

          else if (parseInt(board[cell[0]][cell[1]]) !== 0) {
            canPosition = false;
          }

        })

        if (canPosition) {
          setHoverCells([...blockPositionInBoard]);
        }
      }
    }
  }

  const addBlockAtPosition = (position) => {
    if (board[position[0]][position[1]] === 0 && !blocksPlaced[selectedBlock]) {
      addBlockToBoard(position);
    }
  }

  const addBlockToBoard = (position) => {
    if (selectedBlock === 0) {
      return
    }

    const filteredBlocks = blocks.filter(block => block.id === selectedBlock && !block.placed);
    if (filteredBlocks.length === 1) {
      const block = filteredBlocks[0];
      const blockPositionInBoard = block.layout.map(cell => [cell[0]+position[0], cell[1]+position[1]]);

      let canPosition = true;
      blockPositionInBoard.forEach(cell => {

        if (cell[0] >= ROWS || cell[1] >= COLUMNS) {
          canPosition = false;
        }

        else if (parseInt(board[cell[0]][cell[1]]) !== 0) {
          canPosition = false;
        }

      })

      if (!canPosition) {
        alert("Can't place the object");
        return
      }

      setBoard(prevBoard => {
        let newBoard = [...prevBoard.map(row => [...row])];
        blockPositionInBoard.forEach(cell => {
          newBoard[cell[0]][cell[1]] = block.id;
        });
        return newBoard;
      });

      setBlocksPlaced(prevBlocksPlaced => {
        let newBlocksPlaced = [...prevBlocksPlaced];
        newBlocksPlaced[selectedBlock] = true;
        return newBlocksPlaced;
      });

      setSelectedBlock(0);
    }
  }

  const isPartOfLayout = (layout, start, cell) => {

    let partOfLayout = false;
    layout.forEach(currentCell => {
      if (currentCell[0]+start[0] === parseInt(cell[0]) && currentCell[1]+start[1] === parseInt(cell[1])) {
        partOfLayout = true;
      }
    });

    return partOfLayout;
  }

  const isHoverCell = cell => {
    const filteredCell = hoverCells.filter(hoverCell => hoverCell[0] === cell[0] && hoverCell[1] === cell[1]);
    if (filteredCell.length === 1) {
      return true;
    }

    return false;
  }

  return (
    <>
      <NavigationBar />
      <Grid container className="polysphere-wrapper" justifyContent="space-around">
        <Grid item md={4} sm={12} className="grid-item-wrapper">
          <Typography variant="h1">Blocks</Typography>

          <Grid container>
            {
              blocks.map(block => (
                <Grid
                  className={`block-layout-container ${blocksPlaced[block.id] ? "disabled" : ""} ${!blocksPlaced[block.id] && selectedBlock === block.id ? "selected" : ""}`}
                  item key={block.id} sm={3}
                  onClick={() => { !blocksPlaced[block.id] && setSelectedBlock(parseInt(block.id)) }}
                >
                  {
                    Object.keys([...Array(block.rows)]).map(row =>
                      <Box key={row} className="layout-row">
                        {
                          Object.keys([...Array(block.columns)]).map(column => (
                            <Box key={row+"-"+column} className="cell-wrapper">
                              <Box className={`cell block-cell board-cell-${isPartOfLayout(block.layout, block.start, [row, column]) ? block.color + " block-cell-color" : ""}`}></Box>
                            </Box>
                          ))
                        }
                      </Box>
                    )
                  }
                </Grid>
              ))
            }
          </Grid>
        </Grid>


        <Grid item md={6} sm={12} className="grid-item-wrapper">
          <Typography variant="h1">Board</Typography>

          {
            board.map((row, rowIndex) => (
              <Box className="layout-row" key={rowIndex}>
                {
                  row.map((column, columnIndex) => (
                    <Box
                      onClick={() => addBlockAtPosition([rowIndex, columnIndex])}
                      onMouseEnter={() => addHoverCells([rowIndex, columnIndex])}
                      onMouseOut={() => setHoverCells([])}
                      key={columnIndex}
                      className="cell-wrapper"
                    >
                      <Box className={`cell board-cell board-cell-${getCellColor(board[rowIndex][columnIndex])} ${isHoverCell([rowIndex, columnIndex]) ? "board-cell-hover" : ""}`} />
                    </Box>
                  ))
                }
              </Box>
            ))
          }

          <Grid container justifyContent="space-between">
            <Grid item sm={6}>
              <Tooltip title="Start">
                <IconButton onClick={startFittingBlocksInBoard}>
                  <PlayCircleFilledIcon />
                </IconButton>
              </Tooltip>
            </Grid>
            <Grid item sm={6}>
              <Tooltip title="Clear Board">
                <IconButton onClick={clearBoard}>
                  <BackspaceIcon />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  )
}
