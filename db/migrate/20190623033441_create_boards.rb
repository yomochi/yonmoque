class CreateBoards < ActiveRecord::Migration[5.2]
  def change
    create_table :boards do |t|
      t.string :situation, null: false
      t.integer :turn, null: false
      t.integer :blueStock, null: false
      t.integer :whiteStock, null: false
      t.integer :victory, null: false
    end
  end
end
