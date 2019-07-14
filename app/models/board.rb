class Board < ApplicationRecord
  validates :situation, presence: true, length: { is: 97 }
  validates :turn, presence: true, inclusion: { in: [1, 2], message: '%{value} の値は無効です' }
  validates :blueStock, presence: true, inclusion: { in: [*0..6], message: '%{value} の値は無効です' }
  validates :whiteStock, presence: true, inclusion: { in: [*0..6], message: '%{value} の値は無効です' }
  validates :victory, presence: true, inclusion: { in: [*0..2], message: '%{value} の値は無効です' }
end
