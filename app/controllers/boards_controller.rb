class BoardsController < ApplicationController
  def index; end

  def new
    @board = Board.new
  end

  def create
    Board.create(board_params)
  end

  def show
    @board = Board.find(params[:id])
    render json: @board
  end

  def edit
    @board = Board.find(params[:id])
  end

  def update
    board = Board.find(params[:id])

    if board
      board.update(board_params)
    else
      Board.create(board_params)
    end

    head :no_content
  end

  def destroy; end

  private

  # require model permitが許可するカラム
  def board_params
    params.require(:board).permit(:situation, :turn, :blueStock, :whiteStock, :victory)
  end
end
