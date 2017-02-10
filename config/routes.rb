Rails.application.routes.draw do
  resources :location
  devise_for :admins
  root to: 'admin#index'
end
