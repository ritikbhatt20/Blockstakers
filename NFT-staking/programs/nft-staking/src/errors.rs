use anchor_lang::error_code;

#[error_code]
pub enum StakeError {
    #[msg("Incorrect mint")]
    IncorrectMint,
    #[msg("Incorrect collection")]
    IncorrectCollection,
    #[msg("Collection not verified")]
    CollectionNotVerified,
    #[msg("Maximum stake limit reached")]
    MaxStakeReached,
    #[msg("Cannot unstake yet - freeze period not elapsed")]
    FreezePeriodNotElapsed,
}
