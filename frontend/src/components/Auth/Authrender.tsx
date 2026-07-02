import AuthLayout from './AuthLayout';
import FarmerSignup from './FarmerSignup';
import InvestorSignup from './InvestorSignup';
import SignIn from './SignIn';
import UserTypeSelection from './UserTypeSelection';

const Authrender = () => {
  return (
    <div>
      <AuthLayout title="Sign In" subtitle="Access your account" showBackButton>
        <SignIn />
      </AuthLayout>
      <AuthLayout title="Farmer Signup" subtitle="Register as a farmer" showBackButton>
        <FarmerSignup />
      </AuthLayout>
      <AuthLayout title="Investor Signup" subtitle="Register as an investor" showBackButton>
        <InvestorSignup />
      </AuthLayout>
      <AuthLayout title="Choose User Type" subtitle="Select your role" showBackButton>
        <UserTypeSelection />
      </AuthLayout>
    </div>
  );
};

export default Authrender;