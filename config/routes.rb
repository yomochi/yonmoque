Rails.application.routes.draw do
  get 'rooms/show'
  devise_for :users
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  root 'yonmoque#top'
  resources :boards
  resources :rooms, only: [:index, :show]
end
