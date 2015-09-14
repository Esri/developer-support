//  ShortOauthSample

#import "ViewController.h"
#import "AppDelegate.h"

@interface ViewController ()

@property (nonatomic, strong)AGSPortal* portal;
@property (nonatomic, strong)UIButton* signInButton;
@property (nonatomic,strong) AGSOAuthLoginViewController* oauthLoginVC; //View controller already included in ArcGIS iOS SDK to facilitate secure authorization via OAuth2

@end

@implementation ViewController

- (void)viewDidLoad
{
    [super viewDidLoad];
    [self createSignInButton];
}

-(void) createSignInButton
{
    self.signInButton = [UIButton buttonWithType:UIButtonTypeRoundedRect];
    [self.signInButton addTarget:self action:@selector(signIn:) forControlEvents:UIControlEventTouchUpInside];
    [self.signInButton setFrame:CGRectMake(0, 10, 100, 50)]; //x screen cord, y screen cord, width, height
    [self.signInButton setTitle:@"Sign In" forState:UIControlStateNormal];
    [self.signInButton setExclusiveTouch:YES];
    [self.view addSubview:self.signInButton];
}

-(void) showUserName:(NSString *)userName
{
    self.signInButton.hidden = true;
    NSString * greeting = [NSString stringWithFormat:@"Hello %@%@", userName, @"!"];
    UILabel *label =  [[UILabel alloc] initWithFrame: CGRectMake(0, 10, 200, 50)];
    label.text = greeting;
    [self.view addSubview:label];
}

- (void) cancelLogin{
    [self dismissViewControllerAnimated:YES completion:nil];
}

-(IBAction)signIn:(id)sender {
    NSString *kPortalUrl = @"https://www.arcgis.com";
    NSString *kClientID = @"DmRvORVZyyqDiEaI";
    self.oauthLoginVC = [[AGSOAuthLoginViewController alloc] initWithPortalURL:[NSURL URLWithString:kPortalUrl] clientID:kClientID];
    
    UINavigationController* nvc = [[UINavigationController alloc]initWithRootViewController:self.oauthLoginVC];
    
    nvc.modalTransitionStyle = UIModalTransitionStyleFlipHorizontal; //Yeah flip transition
    self.oauthLoginVC.navigationItem.rightBarButtonItem = [[UIBarButtonItem alloc]initWithTitle:@"Cancel" style:UIBarButtonItemStyleBordered target:self action:@selector(cancelLogin)];
    
    [self presentViewController:nvc animated:YES completion:nil];
    
    self.oauthLoginVC.completion = ^(AGSCredential *credential, NSError *error){
        if(error){
            if(error.code == NSURLErrorServerCertificateUntrusted){ //If certificate error
                NSLog(@"Certificate error : %@", error.description);
            } else {
                NSLog(@"Generic error : %@", error.description);
            }
        }
        else{
            //Connect to the portal using the credential provided by the user.
            self.portal = [[AGSPortal alloc]initWithURL:[NSURL URLWithString: kPortalUrl] credential:credential];
            self.portal.delegate = self;
        }
        
    };
}

- (void)portalDidLoad:(AGSPortal *)portal {
    
    NSLog(@"Authenticated Username : %@", portal.credential.username);
    [self showUserName:portal.credential.username];
    if(self.presentedViewController){
        [self dismissViewControllerAnimated:YES completion:nil];
    }
}

- (void)portal:(AGSPortal *)portal didFailToLoadWithError:(NSError *)error {
    NSLog(@"%@",[error localizedDescription]);
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
}

@end