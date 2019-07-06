require 'rails_helper'

RSpec.describe Board, type: :model do
  describe 'validations' do
    it { should validate_presence_of(:situation) }
    it { should validate_presence_of(:turn) }
    it { should validate_presence_of(:blueStock) }
    it { should validate_presence_of(:whiteStock) }
    it { should validate_presence_of(:victory) }
  end

  describe 'turn' do
    it "turnの値を確認するテスト" do
      board = Board.new(
        situation: '0' * 97,
        turn: 1,
        blueStock: 1,
        whiteStock: 1,
        victory: 1
      )
      expect(board).to be_valid
    end
  end
end
