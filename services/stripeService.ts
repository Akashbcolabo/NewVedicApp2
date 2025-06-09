// Mock Stripe Service

interface StripeSession {
    id: string;
    // Add other relevant session properties if needed for mock
  }
  
  export const StripeService = {
    async createDonationSession(amount: number, description: string): Promise<StripeSession> {
      console.log(`Mock Stripe: Creating session for amount: ${amount}, description: "${description}"`);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
  
      // Simulate potential failure for testing
      if (amount < 100) { // Arbitrary condition for mock failure
        // console.error("Mock Stripe: Donation amount too low, session creation failed.");
        // throw new Error("Mock Stripe Error: Amount too low for session creation.");
        // For this mock, let's assume it can still create a session ID but a real Stripe might reject.
      }
      
      // Generate a mock session ID
      const mockSessionId = `sess_mock_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
      console.log(`Mock Stripe: Session created with ID: ${mockSessionId}`);
      return { id: mockSessionId };
    },
  
    async redirectToCheckout(sessionId: string): Promise<void> {
      console.log(`Mock Stripe: Attempting to redirect to checkout for session ID: ${sessionId}`);
      // In a real Stripe integration, this would redirect the user to Stripe's checkout page.
      // For this mock, we'll just log it and potentially show an alert.
      alert(`Mock Stripe: Would redirect to checkout for session ${sessionId}. Payment considered successful for mock.`);
      // Simulate a successful redirection/payment outcome
      return Promise.resolve();
    }
  };
  