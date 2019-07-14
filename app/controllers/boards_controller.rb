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
    Board.find(params[:id]).update(board_params)
    head :no_content
  end

  def destroy; end

  private
  #require モデル　permitが許可するカラム
  def board_params
    params.require(:board).permit(:situation, :turn, :blueStock, :whiteStock, :victory)
  end
end
