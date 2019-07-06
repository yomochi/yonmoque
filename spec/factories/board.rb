FactoryBot.define do
  factory :board do
    situation { '0' * 97 }
    turn  { 1 }
    blueStock { 6 }
    whiteStock { 6 }
    victory { 0 }
  end
end
