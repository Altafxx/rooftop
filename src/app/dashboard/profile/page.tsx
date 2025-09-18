'use client';

import { useState } from 'react';
import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { UserAvatarProfile } from '@/components/user-avatar-profile';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { IconUser, IconMail, IconPhone, IconMapPin, IconCalendar, IconEdit } from '@tabler/icons-react';

// Mock user data - in a real app, this would come from your auth system or API
const mockUser = {
    id: '1',
    fullName: 'Ahmad Faiz bin Abdullah',
    emailAddresses: [{ emailAddress: 'ahmad.faiz@rooftop.my' }],
    imageUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=Ahmad%20Faiz',
    phone: '+60 12-345 6789',
    location: 'Kuala Lumpur, Malaysia',
    timezone: 'Asia/Kuala_Lumpur',
    bio: 'Passionate software developer from Malaysia, dedicated to building innovative solutions for the local market.',
    joinedDate: '2023-03-15',
    role: 'Senior Developer',
    department: 'Engineering'
};

export default function ProfilePage() {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        fullName: mockUser.fullName,
        email: mockUser.emailAddresses[0].emailAddress,
        phone: mockUser.phone,
        location: mockUser.location,
        timezone: mockUser.timezone,
        bio: mockUser.bio,
        role: mockUser.role,
        department: mockUser.department
    });

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = () => {
        // In a real app, you would make an API call here
        toast.success('Profile updated successfully!');
        setIsEditing(false);
    };

    const handleCancel = () => {
        // Reset form data to original values
        setFormData({
            fullName: mockUser.fullName,
            email: mockUser.emailAddresses[0].emailAddress,
            phone: mockUser.phone,
            location: mockUser.location,
            timezone: mockUser.timezone,
            bio: mockUser.bio,
            role: mockUser.role,
            department: mockUser.department
        });
        setIsEditing(false);
    };

    return (
        <PageContainer scrollable={true}>
            <div className="flex flex-1 flex-col space-y-6">
                {/* Header */}
                <div className="flex items-start justify-between">
                    <Heading
                        title="Profile"
                        description="Manage your account settings and preferences."
                    />
                    <Button
                        onClick={() => setIsEditing(!isEditing)}
                        variant={isEditing ? "outline" : "default"}
                    >
                        <IconEdit className="mr-2 h-4 w-4" />
                        {isEditing ? 'Cancel' : 'Edit Profile'}
                    </Button>
                </div>
                <Separator />

                <div className="grid gap-6 md:grid-cols-3">
                    {/* Profile Overview Card */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader className="text-center">
                                <div className="flex justify-center mb-4">
                                    <UserAvatarProfile
                                        user={mockUser}
                                        className="h-24 w-24"
                                    />
                                </div>
                                <CardTitle>{formData.fullName}</CardTitle>
                                <CardDescription>{formData.role} • {formData.department}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center space-x-2 text-sm">
                                    <IconMail className="h-4 w-4 text-muted-foreground" />
                                    <span>{formData.email}</span>
                                </div>
                                <div className="flex items-center space-x-2 text-sm">
                                    <IconPhone className="h-4 w-4 text-muted-foreground" />
                                    <span>{formData.phone}</span>
                                </div>
                                <div className="flex items-center space-x-2 text-sm">
                                    <IconMapPin className="h-4 w-4 text-muted-foreground" />
                                    <span>{formData.location}</span>
                                </div>
                                <div className="flex items-center space-x-2 text-sm">
                                    <IconCalendar className="h-4 w-4 text-muted-foreground" />
                                    <span>Joined {new Date(mockUser.joinedDate).toLocaleDateString()}</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Actions Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Button variant="outline" className="w-full justify-start">
                                    <IconUser className="mr-2 h-4 w-4" />
                                    Change Avatar
                                </Button>
                                <Button variant="outline" className="w-full justify-start">
                                    <IconMail className="mr-2 h-4 w-4" />
                                    Email Preferences
                                </Button>
                                <Button variant="outline" className="w-full justify-start">
                                    <IconCalendar className="mr-2 h-4 w-4" />
                                    Calendar Settings
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Profile Details Card */}
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>Personal Information</CardTitle>
                            <CardDescription>
                                Update your personal details and contact information.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="fullName">Full Name</Label>
                                    <Input
                                        id="fullName"
                                        value={formData.fullName}
                                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                                        disabled={!isEditing}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        disabled={!isEditing}
                                    />
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone</Label>
                                    <Input
                                        id="phone"
                                        value={formData.phone}
                                        onChange={(e) => handleInputChange('phone', e.target.value)}
                                        disabled={!isEditing}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="location">Location</Label>
                                    <Input
                                        id="location"
                                        value={formData.location}
                                        onChange={(e) => handleInputChange('location', e.target.value)}
                                        disabled={!isEditing}
                                    />
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="role">Role</Label>
                                    <Input
                                        id="role"
                                        value={formData.role}
                                        onChange={(e) => handleInputChange('role', e.target.value)}
                                        disabled={!isEditing}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="department">Department</Label>
                                    <Input
                                        id="department"
                                        value={formData.department}
                                        onChange={(e) => handleInputChange('department', e.target.value)}
                                        disabled={!isEditing}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="timezone">Timezone</Label>
                                <Select
                                    value={formData.timezone}
                                    onValueChange={(value) => handleInputChange('timezone', value)}
                                    disabled={!isEditing}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Asia/Kuala_Lumpur">Malaysia Time (MYT)</SelectItem>
                                        <SelectItem value="Asia/Singapore">Singapore Time (SGT)</SelectItem>
                                        <SelectItem value="Asia/Jakarta">Western Indonesia Time (WIB)</SelectItem>
                                        <SelectItem value="Asia/Bangkok">Indochina Time (ICT)</SelectItem>
                                        <SelectItem value="Asia/Manila">Philippine Time (PHT)</SelectItem>
                                        <SelectItem value="Asia/Tokyo">Japan Standard Time (JST)</SelectItem>
                                        <SelectItem value="Asia/Shanghai">China Standard Time (CST)</SelectItem>
                                        <SelectItem value="Asia/Dubai">Gulf Standard Time (GST)</SelectItem>
                                        <SelectItem value="Europe/London">Greenwich Mean Time (GMT)</SelectItem>
                                        <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="bio">Bio</Label>
                                <textarea
                                    id="bio"
                                    value={formData.bio}
                                    onChange={(e) => handleInputChange('bio', e.target.value)}
                                    disabled={!isEditing}
                                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    rows={3}
                                    placeholder="Tell us about yourself..."
                                />
                            </div>

                            {isEditing && (
                                <div className="flex gap-2 pt-4">
                                    <Button onClick={handleSave}>
                                        Save Changes
                                    </Button>
                                    <Button variant="outline" onClick={handleCancel}>
                                        Cancel
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </PageContainer>
    );
}
