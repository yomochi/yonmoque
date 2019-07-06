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
    let(:turn) { 1 }
    let(:board) { build(:board, turn: turn) }

    it { expect(board).to be_valid }

    context 'turnの値が4の場合' do
      let(:turn) { 4 }

      it { expect(board).to_not be_valid }
    end
  end
end
