use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::{env, near_bindgen, setup_alloc, AccountId, Balance, Promise, PromiseOrValue, log};
use near_sdk::collections::UnorderedMap;

setup_alloc!();

const PROB:u8 = 128;
const MAX_BET: u128 = 5_000_000_000_000_000_000_000_000; // 5 NEAR
const MIN_BET: u128 = 100_000_000_000_000_000_000_000; // 0.1 NEAR
const ONE_NEAR: u128 = 1_000_000_000_000_000_000_000_000; // 1 NEAR

#[near_bindgen]

#[derive(BorshDeserialize, BorshSerialize)]
pub struct CoinFlip {
    pub owner_id: AccountId,
    pub balance: UnorderedMap<AccountId, Balance>,
}

impl Default for CoinFlip {
    fn default() -> Self {
        panic!("Init before usage")
    }
}

#[near_bindgen]
impl CoinFlip {
    #[init]
    pub fn new(owner_id: AccountId) -> Self {
        assert!(env::is_valid_account_id(owner_id.as_bytes()), "Invalid owner account");
        assert!(!env::state_exists(), "Already initialized");
        Self {
            owner_id,
            balance: UnorderedMap::new(b"balance".to_vec()),
        }
    }

    // Deposit funds and 'quick play' without having to sign a new tx each bet
    // I personally don't like this so didn't support this on frontend

    // #[payable]
    // pub fn deposit(&mut self) {
    //     let account_id = env::signer_account_id();
    //     let deposit = env::attached_deposit();
    //     let mut balance = self.balance.get(&account_id).unwrap_or(0);
    //     balance = balance + deposit;
    //     self.balance.insert(&account_id, &balance);
    // }

    // pub fn play(&mut self, bet: u128, choice: u8) -> u8 {
    //     assert!(choice == 0 || choice == 1);
    //     let account_id = env::signer_account_id();
    //     let mut balance = self.balance.get(&account_id).unwrap_or(0);
    //     assert!(balance >= bet, "no balance to play");
    //     balance = balance - bet;

    //     let result: u8;
    //     let rand: u8 = *env::random_seed().get(0).unwrap();
    //     if rand < PROB {
    //         result = 0;
    //     } else {
    //         result = 1;
    //     }

    //     if choice == result {
    //         balance = balance + (bet*2);
    //     }
    //     self.balance.insert(&account_id, &balance);
    //     result
    // }

    // pub fn get_balance(&self, account_id: AccountId) -> u128 {
    //     self.balance.get(&account_id).unwrap_or(0).into()
    // }

    // Instant play, user attaches deposit as bet amount
    // 0 = Heads
    // 1 = Tails
    #[payable]
    pub fn instant_play(&mut self, choice: u8) -> PromiseOrValue<String> {
        let bet = env::attached_deposit();

        // If not heads or tails then panic
        assert!(choice == 0 || choice == 1, "Invalid choice");

        // If deposit is higher than max bet then panic
        assert!(MAX_BET <= 5_000_000_000_000_000_000_000_000 && bet >= MIN_BET, "Invalid bet amount");
        log!("Bet: {}", bet.to_string());

        // User wins double bet amount, if contract doesn't have enough funds to pay this out then panic
        let winnings: u128 = bet*2; 
        let current_balance = env::account_balance();
        assert!(current_balance >= winnings*2+ONE_NEAR, "Contract balance too low to payout any bets");

        let account_id = env::signer_account_id();
        let result: u8;
        // 50/50 probability 
        let rand: u8 = *env::random_seed().get(0).unwrap();
        if rand < PROB {
            result = 0;
            log!("Heads")
        } else {
            result = 1;
            log!("Tails")
        }

        if choice == result {
            log!("Won");
            log!("{}", bet.to_string());
            PromiseOrValue::Promise(Promise::new(account_id).transfer(winnings))
        } else {
            log!("Lost");
            log!("{}", bet.to_string());
            PromiseOrValue::Value(String::from("Lost"))
        }
    }
}
